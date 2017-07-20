// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject, formatMessage} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import './styles/Launcher.scss';
import * as chatActions from 'actions/chatActions';
import {getChatClient} from '../ChatClient';
import messages from 'messages';
import {displayError, isIEorSafari, inStandaloneMode} from 'utils/utils';
import {noAgentsAvailableClass, ChatInitializedState} from 'appConstants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import type {IntlObject, ChatState, Message, ChatInitializedStateType} from 'types';
import type {QuiqChatClientType} from 'quiq-chat';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,
  popped: boolean,

  setChatPopped: (popped: boolean) => void,
  setChatContainerHidden: (chatContainerHidden: boolean) => void,
  setChatLauncherHidden: (chatLauncherHidden: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setWelcomeFormSubmitted: (welcomeFormSubmitted: boolean) => void,
  setAgentTyping: (typing: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
};

export class Launcher extends Component {
  props: LauncherProps;
  state: LauncherState = {};
  determineLauncherStateInterval: number;
  typingTimeout: ?number;
  autoPopTimeout: ?number;
  client: QuiqChatClientType;

  constructor() {
    super();
    this.client = getChatClient();
  }

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.registerClientCallbacks();
    this.bindChatButtons();
    this.determineLauncherStateInterval = setInterval(this.determineLauncherState, 1000 * 60);

    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.determineLauncherStateInterval);
    clearTimeout(this.typingTimeout);
    clearTimeout(this.autoPopTimeout);
  }

  componentWillReceiveProps(nextProps: LauncherProps) {
    if (
      QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0 &&
      this.props.chatLauncherHidden !== nextProps.chatLauncherHidden
    ) {
      this.updateCustomChatButtons(!!nextProps.chatLauncherHidden);
    }
  }

  determineLauncherState = async () => {
    if (
      // User is in active session, allow them to continue
      this.client.isChatVisible() ||
      !this.props.chatContainerHidden ||
      this.props.popped
    ) {
      if (this.props.chatLauncherHidden) {
        this.props.setChatLauncherHidden(false);
      }
      return;
    }

    const {available} = await this.client.checkForAgents();
    this.updateLauncherHidden(!available);
  };

  updateLauncherHidden = (hidden: boolean) => {
    if (hidden !== this.props.chatLauncherHidden) {
      this.props.setChatLauncherHidden(hidden);
    }
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

  registerClientCallbacks = () => {
    this.client
      .onNewMessages(this.props.updateTranscript)
      .onAgentTyping(this.handleAgentTyping)
      .onConnectionStatusChange((connected: boolean) =>
        this.updateInitializedState(
          connected ? ChatInitializedState.INITIALIZED : ChatInitializedState.DISCONNECTED,
        ),
      )
      .onError(() => this.updateInitializedState(ChatInitializedState.ERROR))
      .onErrorResolved(() => this.updateInitializedState(ChatInitializedState.INITIALIZED))
      .onBurn(() => this.updateInitializedState(ChatInitializedState.ERROR));
  };

  init = async () => {
    this.determineLauncherState();

    // Standalone Mode
    // Never show launcher
    // Always start session, show ChatContainer
    if (inStandaloneMode()) {
      this.updateLauncherHidden(true);
      this.updateContainerHidden(false);
      this.startSession();
      return;
    }

    // ChatContainer Visible
    // Show launcher if transcript length > 0
    // Always start session, show ChatContainer if launcher visible
    if (this.client.isChatVisible()) {
      await this.startSession();

      if (!this.props.chatLauncherHidden) {
        this.updateContainerHidden(false);
      }

      return;
    }

    // User has submitted welcome form or sent message, ChatContainer not visible
    // Show launcher if transcript length > 0
    // Always start session, don't change ChatContainer
    if (this.client.hasTakenMeaningfulAction()) {
      this.startSession();
    }

    if (!this.props.chatLauncherHidden) {
      this.handleAutoPop();
    }
  };

  startSession = async () => {
    if (
      this.props.initializedState === ChatInitializedState.LOADING ||
      this.props.initializedState === ChatInitializedState.INITIALIZED
    )
      return;

    try {
      this.updateInitializedState(ChatInitializedState.LOADING);
      await this.client.start();
      this.updateInitializedState(ChatInitializedState.INITIALIZED);

      // User has session in progress. Send them right to it.
      if (this.props.transcript.length > 0) {
        this.updateLauncherHidden(false);
        this.props.setWelcomeFormSubmitted(true);
      }
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
    if (!isIEorSafari() && typeof QUIQ.AUTO_POP_TIME === 'number') {
      this.autoPopTimeout = setTimeout(() => {
        if (this.props.chatLauncherHidden) return;

        this.startSession();
        this.updateContainerHidden(false);
      }, QUIQ.AUTO_POP_TIME);
    }
  };

  updateCustomChatButtons = (agentsAvailable: boolean) => {
    try {
      QUIQ.CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
        const ele = document.querySelector(selector);
        if (!ele) return displayError(messages.unableToFindCustomLauncherError);

        agentsAvailable
          ? ele.classList.remove(noAgentsAvailableClass)
          : ele.classList.add(noAgentsAvailableClass);
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToFindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  bindChatButtons = () => {
    try {
      QUIQ.CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
        const ele = document.querySelector(selector);
        if (!ele) return displayError(messages.unableToBindCustomLauncherError);

        ele.addEventListener('click', this.toggleChat);
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToBindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  toggleChat = async () => {
    if (this.props.popped || isIEorSafari()) {
      return openStandaloneMode({
        onPop: () => {
          this.props.setChatPopped(true);
          getChatClient().joinChat();
        },
        onFocus: () => {
          this.props.setChatPopped(true);
        },
        onDock: () => {
          this.props.setChatPopped(false);
        },
      });
    }

    if (this.props.chatContainerHidden) {
      this.updateContainerHidden(false);
      await this.startSession();
      this.client.joinChat();
    } else {
      this.updateContainerHidden(true);
      this.client.leaveChat();
    }
  };

  render() {
    return (
      <div className="Launcher">
        {!this.props.chatContainerHidden && <ChatContainer />}
        {QUIQ.CUSTOM_LAUNCH_BUTTONS.length === 0 &&
          !inStandaloneMode() &&
          !this.props.chatLauncherHidden &&
          <ToggleChatButton toggleChat={this.toggleChat} />}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state: ChatState) => ({
      chatContainerHidden: state.chatContainerHidden,
      chatLauncherHidden: state.chatLauncherHidden,
      popped: state.popped,
      initializedState: state.initializedState,
      transcript: state.transcript,
    }),
    chatActions,
  ),
)(Launcher);
