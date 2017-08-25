// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import './styles/Launcher.scss';
import * as chatActions from 'actions/chatActions';
import QuiqChatClient from 'quiq-chat';
import messages from 'messages';
import {displayError, isMobile, inStandaloneMode} from 'utils/utils';
import {noAgentsAvailableClass, mobileClass, ChatInitializedState} from 'appConstants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import type {IntlObject, ChatState, Message, ChatInitializedStateType} from 'types';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  popped: boolean,
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,
  welcomeFormRegistered: boolean,

  setChatContainerHidden: (chatContainerHidden: boolean) => void,
  setChatLauncherHidden: (chatLauncherHidden: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setChatPopped: (popped: boolean) => void,
  setWelcomeFormRegistered: () => void,
  setAgentTyping: (typing: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
  newWebchatSession: () => void,
};

export class Launcher extends Component {
  props: LauncherProps;
  state: LauncherState = {};
  determineLauncherStateInterval: number;
  updateCustomChatButtonsInterval: number;
  typingTimeout: ?number;
  autoPopTimeout: ?number;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.registerClientCallbacks();
    this.determineLauncherStateInterval = setInterval(this.determineLauncherState, 1000 * 60);

    if (!this.props.chatLauncherHidden) {
      clearTimeout(this.autoPopTimeout);
    }

    this.init();
  }

  componentWillReceiveProps(nextProps: LauncherProps) {
    if (this.props.chatContainerHidden && !nextProps.chatContainerHidden) {
      clearTimeout(this.autoPopTimeout);
    }
  }

  componentWillUnmount() {
    clearInterval(this.determineLauncherStateInterval);
    clearInterval(this.updateCustomChatButtonsInterval);
    clearTimeout(this.typingTimeout);
    clearTimeout(this.autoPopTimeout);
  }

  determineLauncherState = async () => {
    // If user is on mobile, and they have not set a number, keep launcher buttons hidden
    if (!QUIQ.MOBILE_NUMBER && isMobile()) this.props.setChatLauncherHidden(true);
    else if (
      // User is in active session, allow them to continue
      QuiqChatClient.isChatVisible() ||
      QuiqChatClient.hasTakenMeaningfulAction() ||
      !this.props.chatContainerHidden ||
      this.props.popped ||
      this.props.transcript.length ||
      (QUIQ.WELCOME_FORM && this.props.welcomeFormRegistered)
    ) {
      if (this.props.chatLauncherHidden) {
        this.props.setChatLauncherHidden(false);
      }
      return;
    }

    const {available} = await QuiqChatClient.checkForAgents();
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

  handleNewSession = () => {
    this.props.newWebchatSession();
  };

  registerClientCallbacks = () => {
    QuiqChatClient.onNewMessages(this.props.updateTranscript);
    QuiqChatClient.onRegistration(this.props.setWelcomeFormRegistered);
    QuiqChatClient.onAgentTyping(this.handleAgentTyping);
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
    await this.determineLauncherState();
    this.bindChatButtons();

    // Standalone Mode
    // Never show launcher
    // Always start session, show ChatContainer
    if (inStandaloneMode()) {
      this.updateLauncherHidden(true);
      this.updateContainerHidden(false);
      this.startSession();
      return;
    }

    // ChatContainer Visible from cookie
    // Always start session, always show launcher
    if (QuiqChatClient.isChatVisible()) {
      await this.startSession();
      this.updateLauncherHidden(false);
      this.updateContainerHidden(false);
      return;
    }

    // User has submitted welcome form or sent message, ChatContainer not visible
    // Show launcher if transcript length > 0
    // Always start session, don't change ChatContainer
    if (QuiqChatClient.hasTakenMeaningfulAction()) {
      await this.startSession();
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
      await QuiqChatClient.start();
      this.updateInitializedState(ChatInitializedState.INITIALIZED);

      // User has session in progress. Send them right to it.
      if (this.props.transcript.length > 0) {
        this.updateLauncherHidden(false);
        this.props.setWelcomeFormRegistered();
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
    if (!isMobile() && typeof QUIQ.AUTO_POP_TIME === 'number') {
      this.autoPopTimeout = setTimeout(() => {
        if (this.props.chatLauncherHidden) return;

        this.startSession();
        this.updateContainerHidden(false);
      }, QUIQ.AUTO_POP_TIME);
    }
  };

  handleClientInactiveTimeout = () => {
    this.updateInitializedState(ChatInitializedState.INACTIVE);
    if (inStandaloneMode()) {
      QuiqChatClient.leaveChat();
    } else {
      if (!this.props.chatContainerHidden && !this.props.popped) {
        this.updateContainerHidden(true);
        QuiqChatClient.leaveChat();
      }
    }
  };

  bindChatButtons = () => {
    const {CUSTOM_LAUNCH_BUTTONS} = QUIQ;
    if (!CUSTOM_LAUNCH_BUTTONS || CUSTOM_LAUNCH_BUTTONS.length === 0) return;

    const updateChatButtons = () => {
      CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
        const ele = document.querySelector(selector);
        if (!ele) return displayError(messages.unableToBindCustomLauncherError);

        this.props.chatLauncherHidden
          ? ele.classList.add(noAgentsAvailableClass)
          : ele.classList.remove(noAgentsAvailableClass);

        if (isMobile()) ele.classList.add(mobileClass);
      });
    };

    CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
      const ele = document.querySelector(selector);
      if (!ele) return displayError(messages.unableToBindCustomLauncherError);
      ele.addEventListener('click', this.toggleChat);
    });
    this.updateCustomChatButtonsInterval = setInterval(updateChatButtons, 2000);
    updateChatButtons();
  };

  openNativeSMSApp = () => {
    if (QUIQ.MOBILE_NUMBER) {
      window.location = `sms:${QUIQ.MOBILE_NUMBER}`;
    }
  };

  toggleChat = async () => {
    if (isMobile()) {
      this.openNativeSMSApp();
      return;
    }

    if (this.props.popped) {
      return openStandaloneMode({
        onPop: () => {
          this.props.setChatPopped(true);
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
      QuiqChatClient.joinChat();
    } else {
      this.updateContainerHidden(true);
      QuiqChatClient.leaveChat();
    }
  };

  render() {
    // Do not show chat no agents are available OR we're on a mobile device and no mobile number was provided in QUIQ object
    if (isMobile() && !QUIQ.MOBILE_NUMBER) return null;

    return (
      <div className="Launcher">
        {!this.props.chatContainerHidden && !isMobile() && <ChatContainer />}
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
      welcomeFormRegistered: state.welcomeFormRegistered,
    }),
    chatActions,
  ),
)(Launcher);
