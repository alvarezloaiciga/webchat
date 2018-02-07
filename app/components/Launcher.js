// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'core-ui/services/i18nService';
import ChatContainer from './ChatContainer';
import QuiqChatClient from 'quiq-chat';
import * as chatActions from 'actions/chatActions';
import {
  inStandaloneMode,
  isMobile,
  isLastMessageFromAgent,
  convertToExtensionMessages,
  domainIsAllowed,
  getHostingDomain,
  displayError,
} from 'Common/Utils';
import {destructApp, reloadApp} from 'utils/domUtils';
import {ChatInitializedState, eventTypes, displayModes} from 'Common/Constants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {getMetadataForSentry} from 'utils/errorUtils';
import {getMuteSounds, getConfiguration} from 'reducers/chat';
import type {
  IntlObject,
  ChatState,
  Message,
  ChatInitializedStateType,
  ChatMetadata,
  ChatConfiguration,
} from 'types';
import type {PersistentData, Author} from 'quiq-chat/src/types';
import {tellClient} from 'services/Postmaster';
import {playSound} from 'services/alertService';
import {postExtensionEvent} from 'services/Extensions';
import styled from 'react-emotion';
import {getStore} from '../store';

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
  setTypingAuthorData: (author: Author | null) => void,
  updateTranscript: (transcript: Array<Message>) => void,
  updatePlatformEvents: (event: Event) => void,
  newWebchatSession: () => void,
  updateChatConfigurationFromMetadata: (configuration: ChatMetadata) => void,
  removeMessage: (messageId: string) => void,
  setIsAgentAssigned: (isAgentAssigned: boolean) => void,
  updatePersistentData: (data: PersistentData) => void,
};

const LauncherContainer = styled.div`
  z-index: 1000000;
`;

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
      this.props.configuration.agentsAvailableTimer,
    );

    if (!this.props.chatLauncherHidden) {
      clearTimeout(this.autoPopTimeout);
    }

    this.init();

    // TODO: Remove this when WS are used for join/leave
    // If we're in undocked-only mode, and this is a standalone window, we need to fire a leave event whenever window is closed
    if (inStandaloneMode() && this.props.configuration.displayMode === displayModes.UNDOCKED) {
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
    if (this.props.configuration.enforceAgentAvailability && !this.props.configuration._demoMode) {
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
    reloadApp(getStore());
  };

  handleNewMessages = (transcript: Array<Message>) => {
    this.props.updateTranscript(transcript);

    if (this.props.initializedState === ChatInitializedState.INITIALIZED) {
      tellClient(eventTypes.messageArrived, {transcript});

      // Pop chat
      if (
        isLastMessageFromAgent(transcript) &&
        this.props.configuration.displayMode !== displayModes.UNDOCKED
      ) {
        this.props.setChatContainerHidden(false);
      }

      // Play sound
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
    QuiqChatClient.onPersistentDataChange(this.props.updatePersistentData);
    QuiqChatClient._withSentryMetadataCallback(getMetadataForSentry);
  };

  init = async () => {
    const configuration = await QuiqChatClient.getChatConfiguration();
    this.props.updateChatConfigurationFromMetadata(configuration);

    // Domain whitelist enforcement: destroy webchat client if parent window's domain is not whitelisted
    // We use the clientDomain passed in via quiqOptions as a fallback in case we cannot determine the parent domain.
    const hostingDomain = (getHostingDomain() || this.props.configuration.clientDomain).replace(
      /https?:\/\//,
      '',
    );
    if (!domainIsAllowed(hostingDomain, this.props.configuration.whitelistedDomains)) {
      destructApp();
      displayError(
        `The domain "${hostingDomain}" is not allowed to load webchat for this contact point. Make sure to add this domain to your 'Whitelisted Domains' in the admin app.`,
      );
    }

    if (!QuiqChatClient.isUserSubscribed() && !QuiqChatClient.hasTakenMeaningfulAction()) {
      QuiqChatClient.setChatVisible(false);
    }

    // Initial grab of persistent data from QuiqChat
    this.props.updatePersistentData(QuiqChatClient.getPersistentData());

    // Set initial launcher visibility and agent availability states
    await this.updateLauncherState();

    // Start session iff one of the following conditions hold:
    //  * We are in standalone
    //  * Chat is visible (or visible from the cookie), or the user is subscribed, AND we are NOT in undocked-only mode
    if (
      inStandaloneMode() ||
      ((!this.props.chatContainerHidden ||
        QuiqChatClient.isChatVisible() ||
        QuiqChatClient.isUserSubscribed()) &&
        this.props.configuration.displayMode !== displayModes.UNDOCKED)
    ) {
      await this.startSession();
    }

    // Pop chat (set container visibility to true) iff one of the following conditions hold:
    //  * We are in standalone (doesn't have any visual effect, but keeps state up to date)
    //  * Chat is visible from cookie, AND we are NOT in undocked-only mode
    if (
      inStandaloneMode() ||
      (QuiqChatClient.isChatVisible() &&
        this.props.configuration.displayMode !== displayModes.UNDOCKED)
    ) {
      this.updateContainerHidden(false);
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

  handleAgentTyping = (typing: boolean, author: Author) => {
    this.props.setTypingAuthorData(typing ? author : null);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (!typing) return;

    this.typingTimeout = setTimeout(() => {
      this.props.setTypingAuthorData(null);
    }, 10000);
  };

  handleAutoPop = () => {
    if (
      !isMobile() &&
      this.props.configuration.displayMode !== displayModes.UNDOCKED &&
      typeof this.props.configuration.autoPopTime === 'number'
    ) {
      this.autoPopTimeout = setTimeout(async () => {
        if (!await this.updateLauncherState()) return;
        await this.startSession();
        this.updateContainerHidden(false);
      }, this.props.configuration.autoPopTime);
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

      QuiqChatClient.setChatVisible(true);
    } else {
      if (this.props.initializedState !== ChatInitializedState.INACTIVE) {
        QuiqChatClient.setChatVisible(false);
      }
    }
  };

  render() {
    return <LauncherContainer className="Launcher">{<ChatContainer />}</LauncherContainer>;
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
      muteSounds: getMuteSounds(state),
      messageFieldFocused: state.messageFieldFocused,
      configuration: getConfiguration(state),
    }),
    chatActions,
  ),
)(Launcher);
