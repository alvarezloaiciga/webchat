// @flow
import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {formatMessage} from 'utils/i18n';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import WelcomeForm from 'WelcomeForm';
import QUIQ, {validateWelcomeFormDefinition} from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {inStandaloneMode, isIEorSafari} from 'utils/utils';
import {MessageTypes, quiqChatContinuationCookie} from 'appConstants';
import messages from 'messages';
import classnames from 'classnames';
import {getChatClient} from '../ChatClient';
import type {Message, Conversation, AtmosphereMessage, ApiError} from 'types';

import './styles/ChatContainer.scss';

type ChatContainerState = {
  messages: Array<Message>,
  connected: boolean,
  loading: boolean,
  error: boolean,
  agentTyping: boolean,
  welcomeForm: boolean,
  poppedChat: boolean,
};

export type ChatContainerProps = {
  hidden?: boolean,
  onMessage?: (message: Message) => void,
  toggleChat?: (fireEvent?: boolean) => void,
};

const {COLOR, HEADER_TEXT, FONT_FAMILY} = QUIQ;

export class ChatContainer extends Component {
  props: ChatContainerProps;
  state: ChatContainerState = {
    messages: [],
    connected: false,
    loading: true,
    error: false,
    agentTyping: false,
    welcomeForm: !!QUIQ.WELCOME_FORM,
    poppedChat: false,
  };
  typingTimeout: ?number;

  handleChatError = () => {
    this.setState({error: true});
  };

  initialize = async () => {
    const client = getChatClient();

    await client
      .onNewMessages(this.handleNewMessages)
      .onAgentTyping(this.handleAgentTyping)
      .onConnectionStatusChange(this.handleConnectivityChange)
      .onError(this.handleChatError)
      .start();

    this.setState({loading: false});
  };

  componentDidMount() {
    // Validate WELCOME_FORM definition
    validateWelcomeFormDefinition();

    if (!this.state.connected && !this.props.hidden) {
      this.initialize();
    }
  }

  componentWillReceiveProps(nextProps: ChatContainerProps) {
    // We reset poppedChat when user explicitly re-opens chat
    if (this.props.hidden && !nextProps.hidden) {
      this.setState({poppedChat: false});

      if (!this.state.connected) {
        this.initialize();
      }
    }
  }

  componentWillUnmount() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  handleConnectivityChange = (connected: boolean) => {
    this.setState({connected});
  };

  handleAgentTyping = (typing: boolean) => {
    if (typing) this.startAgentTyping();
    else this.stopAgentTyping();
  };

  handleNewMessages = (newMessages: Array<Message>) => {
    // TODO: This will break once we implement the API version of the welcome form.
    // The issue is we want to ensure if you are in standalone mode and submit the form
    // that the docked webchat hides the welcome form.  We will need the API to send a
    // websocket message saying the user submitted their welcome form. Being handled in
    // https://centricient.atlassian.net/browse/SER-4555
    if (this.state.welcomeForm) {
      this.setState({welcomeForm: false});
    }

    this.setState(prevState => ({messages: [...prevState.messages, ...newMessages]}));
  };

  startAgentTyping = () => {
    // Clear the previous timeout if there was one
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.setState({agentTyping: true});
    this.typingTimeout = setTimeout(this.stopAgentTyping.bind(this), 10000);
  };

  stopAgentTyping = () => {
    this.setState({agentTyping: false});
  };

  onWelcomeFormSubmit = () => {
    this.setState({
      welcomeForm: false,
    });
  };

  onPop = (fireEvent: boolean) => {
    if (this.props.toggleChat) {
      this.props.toggleChat(fireEvent);
      this.setState({
        poppedChat: true,
      });
    }
  };

  onMinimize = (fireEvent: boolean) => {
    if (this.props.toggleChat && !this.props.hidden) {
      this.props.toggleChat(fireEvent);
    }
  };

  maximizeChat = (fireEvent: boolean) => {
    if (this.props.toggleChat && this.props.hidden) {
      this.props.toggleChat(fireEvent);
    }
  };

  onDock = (fireEvent: boolean) => {
    this.maximizeChat(fireEvent);
    this.setState({poppedChat: false});
  };

  render() {
    if (this.props.hidden) return null;

    if (this.state.error) {
      return (
        <div className="ChatContainer">
          <div className="errorBanner">
            <FormattedMessage {...messages.errorState} />
          </div>
        </div>
      );
    }

    if (this.state.welcomeForm && !this.state.loading && !this.state.messages.length) {
      return (
        <div
          className={classnames('ChatContainer', {
            standaloneMode: inStandaloneMode(),
          })}
        >
          <WelcomeForm
            onPop={this.onPop}
            onDock={this.onDock}
            onMinimize={this.onMinimize}
            onFormSubmit={this.onWelcomeFormSubmit}
          />
        </div>
      );
    }

    return (
      <div
        className={classnames('ChatContainer', {
          standaloneMode: inStandaloneMode(),
          hasCustomLauncher: !inStandaloneMode() && QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0,
        })}
      >
        <HeaderMenu onPop={this.onPop} onDock={this.onDock} onMinimize={this.onMinimize} />
        <div className="banner" style={{backgroundColor: COLOR}}>
          <span className="messageUs" style={{fontFamily: FONT_FAMILY}}>
            {HEADER_TEXT}
          </span>
        </div>

        {!this.state.connected &&
          !this.state.loading &&
          <div className="errorBanner" style={{fontFamily: FONT_FAMILY}}>
            <FormattedMessage {...messages.reconnecting} />
          </div>}

        <div className="chatContainerBody">
          {this.state.loading ? <Spinner /> : <Transcript messages={this.state.messages} />}
          {!this.state.loading &&
            this.state.connected &&
            <MessageForm agentTyping={this.state.agentTyping} />}
        </div>
      </div>
    );
  }
}

export default ChatContainer;
