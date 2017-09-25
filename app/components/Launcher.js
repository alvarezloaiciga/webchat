// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'Common/i18n';
import quiqOptions from 'Common/QuiqOptions';
import ChatContainer from './ChatContainer';
import './styles/Launcher.scss';
import QuiqChatClient from 'quiq-chat';
import * as chatActions from 'actions/chatActions';
import {inStandaloneMode} from 'Common/Utils';
import {ChatInitializedState} from 'Common/Constants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import type {IntlObject, ChatState, Message, ChatInitializedStateType} from 'types';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,

  setChatContainerHidden: (chatContainerHidden: boolean) => void,
  setChatLauncherHidden: (chatLauncherHidden: boolean) => void,
  setAgentsAvailable: (agentsAvailable: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setWelcomeFormRegistered: () => void,
  setAgentTyping: (typing: boolean) => void,
  setAgentEndedConversation: (ended: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
  newWebchatSession: () => void,
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
    const {available} = await QuiqChatClient.checkForAgents();
    this.props.setAgentsAvailable(available);
    return available;
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
    if (newState === ChatInitializedState.INITIALIZED) {
      this.props.setAgentEndedConversation(false);
    }
  };

  handleNewSession = () => {
    this.props.newWebchatSession();
  };

  registerClientCallbacks = () => {
    QuiqChatClient.onNewMessages(this.props.updateTranscript);
    QuiqChatClient.onRegistration(this.props.setWelcomeFormRegistered);
    QuiqChatClient.onAgentTyping(this.handleAgentTyping);
    QuiqChatClient.onAgentEndedConversation(this.handleAgentEndedConversation);
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
  };

  init = async () => {
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
    // Always start session, always show launcher
    if (QuiqChatClient.isChatVisible()) {
      this.updateContainerHidden(false);
      await this.startSession();
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
      this.updateInitializedState(ChatInitializedState.INITIALIZED);

      // User has session in progress. Send them right to it.
      if (this.props.transcript.length > 0) {
        this.props.setWelcomeFormRegistered();
      }
    } catch (e) {
      this.updateInitializedState(ChatInitializedState.ERROR);
    }
  };

  handleAgentEndedConversation = () => {
    this.props.setAgentEndedConversation(true);
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
    if (!quiqOptions.isMobile && typeof quiqOptions.autoPopTime === 'number') {
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
    }),
    chatActions,
  ),
)(Launcher);
