// @flow
import React from 'react';
import {getChatClient} from '../ChatClient';
import QUIQ, {validateWelcomeFormDefinition} from 'utils/quiq';
import {inStandaloneMode} from 'utils/utils';
import classnames from 'classnames';
import messages from 'messages';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import HeaderMenu from 'HeaderMenu';
import Transcript from 'Transcript';
import Spinner from 'Spinner';
import {formatMessage} from 'utils/i18n';
import {connect} from 'react-redux';
import * as chatActions from 'actions/chatActions';
import {ChatInitializedState} from 'appConstants';
import './styles/ChatContainer.scss';
import type {ChatState, ChatInitializedStateType, Message} from 'types';
import type {QuiqChatClientType} from 'quiq-chat';

export type ChatContainerProps = {
  hidden: boolean,
  transcript: Array<Message>,
  welcomeFormSubmitted: boolean,
  initializedState: ChatInitializedStateType,
  setChatHidden: (hidden: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setWelcomeFormSubmitted: (welcomeFormSubmitted: boolean) => void,
  setAgentTyping: (typing: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
};

export class ChatContainer extends React.Component {
  props: ChatContainerProps;
  client: QuiqChatClientType;
  typingTimeout: ?number;

  constructor() {
    super();
    this.client = getChatClient();
  }

  componentDidMount() {
    if (!this.props.welcomeFormSubmitted) validateWelcomeFormDefinition();

    this.client
      .onNewMessages(this.props.updateTranscript)
      .onAgentTyping(this.handleAgentTyping)
      .onConnectionStatusChange((connected: boolean) =>
        this.props.setChatInitialized(
          connected ? ChatInitializedState.INITIALIZED : ChatInitializedState.DISCONNECTED,
        ),
      )
      .onError(() => this.props.setChatInitialized(ChatInitializedState.ERROR))
      .onErrorResolved(() => this.props.setChatInitialized(ChatInitializedState.INITIALIZED))
      .onBurn(() => this.props.setChatInitialized(ChatInitializedState.ERROR));

    if (inStandaloneMode()) {
      this.props.setChatHidden(false);
      this.init();
    } else if (
      this.props.initializedState === ChatInitializedState.UNINITIALIZED &&
      !this.props.hidden
    ) {
      this.init();
    }
  }

  componentWillReceiveProps(nextProps: ChatContainerProps) {
    if (
      this.props.initializedState === ChatInitializedState.UNINITIALIZED &&
      this.props.hidden &&
      !nextProps.hidden
    ) {
      this.init();
    }
  }

  componentWillUnmount() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  init = async () => {
    if (this.props.initializedState === ChatInitializedState.LOADING) return;

    try {
      this.props.setChatInitialized(ChatInitializedState.LOADING);
      await this.client.start();
      this.props.setChatInitialized(ChatInitializedState.INITIALIZED);
      if (this.props.transcript.length > 0) {
        this.props.setWelcomeFormSubmitted(true);
      }
    } catch (e) {
      this.props.setChatInitialized(ChatInitializedState.ERROR);
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

  renderBanner = () => {
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
      case ChatInitializedState.LOADING:
      case ChatInitializedState.UNINITIALIZED:
        return (
          <div className="banner" style={{backgroundColor: QUIQ.COLOR}}>
            <span className="messageUs" style={{fontFamily: QUIQ.FONT_FAMILY}}>
              {QUIQ.HEADER_TEXT}
            </span>
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
        return (
          <div className="errorBanner" style={{fontFamily: QUIQ.FONT_FAMILY}}>
            {formatMessage(messages.reconnecting)}
          </div>
        );
      case ChatInitializedState.ERROR:
      default:
        return (
          <div className="errorBanner">
            {formatMessage(messages.errorState)}
          </div>
        );
    }
  };

  renderContent = () => {
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
        return (
          <div className="chatContainerBody">
            <Transcript />
            <MessageForm />
          </div>
        );
      case ChatInitializedState.UNINITIALIZED:
      case ChatInitializedState.LOADING:
        return (
          <div className="chatContainerBody">
            <Spinner />
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
      case ChatInitializedState.ERROR:
      default:
        return (
          <div className="chatContainerBody">
            <Transcript />
          </div>
        );
    }
  };

  render() {
    const classNames = classnames(`ChatContainer ${this.props.initializedState}`, {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0,
      hidden: this.props.hidden,
    });

    if (
      this.props.initializedState === ChatInitializedState.INITIALIZED &&
      !this.props.welcomeFormSubmitted &&
      !this.client.isRegistered()
    ) {
      return (
        <div className={classNames} style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT}}>
          <WelcomeForm />
        </div>
      );
    }

    return (
      <div className={classNames} style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT}}>
        <HeaderMenu />
        {this.renderBanner()}
        {this.renderContent()}
      </div>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    hidden: state.hidden,
    initializedState: state.initializedState,
    welcomeFormSubmitted: state.welcomeFormSubmitted,
    transcript: state.transcript,
  }),
  chatActions,
)(ChatContainer);
