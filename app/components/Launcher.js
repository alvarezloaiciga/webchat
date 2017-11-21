// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'core-ui/services/i18nService';
import quiqOptions from 'Common/QuiqOptions';
import ChatContainer from './ChatContainer';
import './styles/Launcher.scss';
import QuiqChatClient from 'quiq-chat';
import * as chatActions from 'actions/chatActions';
import {
  inStandaloneMode,
  isMobile,
  isLastMessageFromAgent,
  convertToExtensionMessages,
} from 'Common/Utils';
import {ChatInitializedState, eventTypes, displayModes} from 'Common/Constants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {getMetadataForSentry} from 'utils/errorUtils';
import type {
  IntlObject,
  ChatState,
  Message,
  ChatInitializedStateType,
  ChatMetadata,
  ChatConfiguration,
} from 'types';
import {tellClient} from 'services/Postmaster';
import {playSound} from 'services/alertService';
import {postExtensionEvent} from 'services/Extensions';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,
  muteSounds: boolean,
  messageFieldFocused: boolean,
  configuration: ChatConfiguration,

  setChatContainerHidden: (chatContainerHidden: boolean) => void,
  setChatLauncherHidden: (chatLauncherHidden: boolean) => void,
  setAgentsAvailable: (agentsAvailable: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setWelcomeFormRegistered: () => void,
  setAgentTyping: (typing: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
  updatePlatformEvents: (event: Event) => void,
  newWebchatSession: () => void,
  setChatConfiguration: (configuration: ChatMetadata) => void,
  removeMessage: (messageId: string) => void,
  setIsAgentAssigned: (isAgentAssigned: boolean) => void,
};

export class Launcher extends Component<LauncherProps, LauncherState> {
  props: LauncherProps;
  state: LauncherState = {};
  updateLauncherVisibilityInterval: number;
  typingTimeout: ?number;
  autoPopTimeout: ?number;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.registerClientCallbacks();
    this.updateLauncherVisibilityInterval = setInterval(
      this.updateLauncherState,
      quiqOptions.agentsAvailableTimer,
    );

    if (!this.props.chatLauncherHidden) {
      clearTimeout(this.autoPopTimeout);
    }

    this.init();

    // TODO: Remove this when WS are used for join/leave
    // If we're in undocked-only mode, and this is a standalone window, we need to fire a leave event whenever window is closed
    if (inStandaloneMode() && quiqOptions.displayMode === displayModes.UNDOCKED) {
      window.addEventListener('unload', () => {
        QuiqChatClient.leaveChat(true);
      });
    }
  }

  componentWillReceiveProps(nextProps: LauncherProps) {
    // Respond to change in chat visibility
    if (nextProps.chatContainerHidden !== this.props.chatContainerHidden)
      this.handleChatVisibilityChange(nextProps.chatContainerHidden);
  }

  componentWillUnmount() {
    clearInterval(this.updateLauncherVisibilityInterval);
    clearTimeout(this.typingTimeout);
    clearTimeout(this.autoPopTimeout);

    // Set to uninitialized in case app will ever be remounted and will need to run through startSession()
    this.updateInitializedState(ChatInitializedState.UNINITIALIZED);
    QuiqChatClient.stop();
  }

  updateAgentAvailability = async (): Promise<boolean> => {
    if (quiqOptions.enforceAgentAvailability && !quiqOptions.demoMode) {
      const {available} = await QuiqChatClient.checkForAgents();
      this.props.setAgentsAvailable(available);

      return available;
    }

    return true;
  };

  updateContainerHidden = (hidden: boolean) => {
    if (hidden !== this.props.chatContainerHidden) {
      this.props.setChatContainerHidden(hidden);
    }
  };

  updateInitializedState = (newState: ChatInitializedStateType) => {
    if (newState !== this.props.initializedState) {
      this.props.setChatInitialized(newState);
    }
  };

  handleNewSession = () => {
    this.props.newWebchatSession();
  };

  handleNewMessages = (transcript: Array<Message>) => {
    this.props.updateTranscript(transcript);

    if (this.props.initializedState === ChatInitializedState.INITIALIZED) {
      tellClient(eventTypes.messageArrived, {transcript});
      if (
        !this.props.muteSounds &&
        !this.props.messageFieldFocused &&
        this.props.configuration.playSoundOnNewMessage &&
        isLastMessageFromAgent(transcript)
      ) {
        playSound();
      }
    }

    postExtensionEvent({
      eventType: 'transcriptChanged',
      data: {messages: convertToExtensionMessages(transcript)},
    });
  };

  registerClientCallbacks = () => {
    QuiqChatClient.onNewMessages(this.handleNewMessages);
    QuiqChatClient.onMessageSendFailure((messageId: string) => {
      this.props.removeMessage(messageId);
    });
    QuiqChatClient.onNewEvents(this.props.updatePlatformEvents);
    QuiqChatClient.onRegistration(this.props.setWelcomeFormRegistered);
    QuiqChatClient.onAgentTyping(this.handleAgentTyping);
    QuiqChatClient.onAgentAssigned(this.props.setIsAgentAssigned);
    QuiqChatClient.onConnectionStatusChange((connected: boolean) =>
      this.updateInitializedState(
        connected ? ChatInitializedState.INITIALIZED : ChatInitializedState.DISCONNECTED,
      ),
    );
    QuiqChatClient.onError(() => this.updateInitializedState(ChatInitializedState.ERROR));
    QuiqChatClient.onErrorResolved(() =>
      this.updateInitializedState(ChatInitializedState.INITIALIZED),
    );
    QuiqChatClient.onBurn(() => this.updateInitializedState(ChatInitializedState.BURNED));
    QuiqChatClient.onNewSession(this.handleNewSession);
    QuiqChatClient.onClientInactiveTimeout(this.handleClientInactiveTimeout);
    QuiqChatClient._withSentryMetadataCallback(getMetadataForSentry);
  };

  init = async () => {
    const configuration = await QuiqChatClient.getChatConfiguration();
    this.props.setChatConfiguration(configuration);

    if (!QuiqChatClient.isUserSubscribed() && !QuiqChatClient.hasTakenMeaningfulAction()) {
      QuiqChatClient.setChatVisible(false);
    }

    // Set initial launcher visibility and agent availability states
    await this.updateLauncherState();

    // Standalone Mode
    // Never show launcher
    // Always start session, show ChatContainer
    if (inStandaloneMode()) {
      this.updateContainerHidden(false);
      await this.startSession();
      return;
    }

    // ChatContainer Visible from cookie
    // Always start session
    // Pop chat open unless we're in undocked-only mode
    if (QuiqChatClient.isChatVisible()) {
      await this.startSession();

      if (quiqOptions.displayMode !== displayModes.UNDOCKED) {
        this.updateContainerHidden(false);
      }

      return;
    }

    // User has submitted welcome form or sent message, ChatContainer not visible
    // Show launcher if transcript length > 0
    // Always start session, don't change ChatContainer
    if (QuiqChatClient.isUserSubscribed()) {
      await this.startSession();
    }

    this.handleAutoPop();
  };

  updateLauncherState = async () => {
    const sessionInProgress =
      QuiqChatClient.isChatVisible() ||
      QuiqChatClient.isUserSubscribed() ||
      QuiqChatClient.hasTakenMeaningfulAction() ||
      !this.props.chatContainerHidden ||
      inStandaloneMode() ||
      this.props.transcript.length ||
      QuiqChatClient.isRegistered();

    // We need to always call updateAgentAvailability() to keep the agentsAvailable state up to data from
    // minute to minute
    const agentsAvailable = await this.updateAgentAvailability();

    if (sessionInProgress) {
      this.props.setChatLauncherHidden(false);
      return true;
    }

    this.props.setChatLauncherHidden(!agentsAvailable);
    return agentsAvailable;
  };

  startSession = async () => {
    if (
      this.props.initializedState === ChatInitializedState.LOADING ||
      this.props.initializedState === ChatInitializedState.INITIALIZED
    )
      return;

    try {
      this.updateInitializedState(ChatInitializedState.LOADING);
      await QuiqChatClient.start();
      this.props.setIsAgentAssigned(QuiqChatClient.isAgentAssigned());
      this.updateInitializedState(ChatInitializedState.INITIALIZED);
    } catch (e) {
      this.updateInitializedState(ChatInitializedState.ERROR);
    }
  };

  handleAgentTyping = (typing: boolean) => {
    this.props.setAgentTyping(typing);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (!typing) return;

    this.typingTimeout = setTimeout(() => {
      this.props.setAgentTyping(false);
    }, 10000);
  };

  handleAutoPop = () => {
    if (
      !isMobile() &&
      quiqOptions.displayMode !== displayModes.UNDOCKED &&
      typeof quiqOptions.autoPopTime === 'number'
    ) {
      this.autoPopTimeout = setTimeout(async () => {
        if (!await this.updateLauncherState()) return;
        await this.startSession();
        this.updateContainerHidden(false);
      }, quiqOptions.autoPopTime);
    }
  };

  handleClientInactiveTimeout = () => {
    this.updateInitializedState(ChatInitializedState.INACTIVE);
    if (!this.props.chatContainerHidden && !inStandaloneMode()) {
      this.updateContainerHidden(true);
    }
  };

  handleChatVisibilityChange = async (hidden: boolean) => {
    if (!hidden) {
      // If container has become visible at any point, we don't want to auto-pop
      clearTimeout(this.autoPopTimeout);

      // If container ever becomes visible, launch buttons need to be made visible
      this.props.setChatLauncherHidden(false);

      await this.startSession();
      QuiqChatClient.joinChat();
    } else {
      if (this.props.initializedState !== ChatInitializedState.INACTIVE) {
        QuiqChatClient.leaveChat();
      }
    }
  };

  render() {
    return <div className="Launcher">{<ChatContainer />}</div>;
  }
}

export default compose(
  injectIntl,
  // $FlowIssue
  connect(
    (state: ChatState) => ({
      chatContainerHidden: state.chatContainerHidden,
      chatLauncherHidden: state.chatLauncherHidden,
      initializedState: state.initializedState,
      transcript: state.transcript,
      welcomeFormRegistered: state.welcomeFormRegistered,
      muteSounds: state.muteSounds,
      messageFieldFocused: state.messageFieldFocused,
      configuration: state.configuration,
    }),
    chatActions,
  ),
)(Launcher);
