// @flow
import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {subscribe, fetchConversation, unsubscribe} from 'quiq-chat';
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
import {set} from 'js-cookie';
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

const {COLOR, HEADER_TEXT, FONT_FAMILY, WIDTH, HEIGHT} = QUIQ;

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

  handleApiError = (err?: ApiError, retry?: () => ?Promise<*>) => {
    if (err && err.status && err.status > 404) {
      if (retry) {
        setTimeout(retry, 5000);
      }
    } else {
      this.setState({error: true});
    }
  };

  initialize = async () => {
    try {
      // Order Matters here.  Ensure we succesfully complete this request before connecting to
      // the websocket below!
      const conversation = await fetchConversation();
      this.setState({messages: this.getTextMessages(conversation.messages)});

      subscribe({
        onConnectionLoss: this.disconnect,
        onConnectionEstablish: this.onConnectionEstablish,
        onMessage: this.handleWebsocketMessage,
        onBurn: this.errorOut,
      });

      set(quiqChatContinuationCookie.id, 'true', {
        expires: quiqChatContinuationCookie.expiration,
      });
    } catch (err) {
      unsubscribe();
      this.handleApiError(err, this.initialize);
    }
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

  connect = () => {
    this.setState({connected: true});
  };

  disconnect = () => {
    this.setState({connected: false});
  };

  /**
   * Triggered from a BurnItDown message.
   * This means the chat is in a fatal state and will need to be reloaded
   */
  errorOut = () => {
    this.setState({
      connected: false,
      error: true,
      loading: false,
    });
  };

  onConnectionEstablish = () => {
    this.connect();
    this.retrieveMessages();
  };

  getTextMessages = (msgs: Array<Message>) =>
    msgs.filter(
      m =>
        m.type === MessageTypes.TEXT &&
        !m.text.includes(formatMessage(messages.welcomeFormUniqueIdentifier).trim()),
    );

  handleWebsocketMessage = (message: AtmosphereMessage) => {
    if (message.messageType === MessageTypes.CHAT_MESSAGE) {
      switch (message.data.type) {
        case 'Text':
          // TODO: This will break once we implement the API version of the welcome form.
          // The issue is we want to ensure if you are in standalone mode and submit the form
          // that the docked webchat hides the welcome form.  We will need the API to send a
          // websocket message saying the user submitted their welcome form. Being handled in
          // https://centricient.atlassian.net/browse/SER-4555
          if (this.state.welcomeForm) {
            this.setState({welcomeForm: false});
          }
          this.appendMessageToChat(message.data);

          // If we popped webchat in standalone mode, and user hasn't explicitly clicked chat button again,
          // don't open it. Also if we are in IE or Safari, we don't allow redocking of the webchat.
          // It is stuck in standalone forever
          if (this.props.onMessage && !isIEorSafari() && !this.state.poppedChat) {
            this.props.onMessage(message.data);
          }
          break;
        case 'AgentTyping':
          if (message.data.typing) {
            this.startAgentTyping();
          } else if (message.data.typing === false) {
            this.stopAgentTyping();
          }
          break;
      }
    }
  };

  appendMessageToChat = (message: Message) => {
    if (
      !this.state.messages.some(m => m.id === message.id) &&
      !message.text.includes(formatMessage(messages.welcomeFormUniqueIdentifier).trim())
    ) {
      this.setState(prevState => ({messages: [...prevState.messages, message]}));
    }
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

  retrieveMessages = () => {
    fetchConversation()
      .then((conversation: Conversation) => {
        this.setState({
          messages: this.getTextMessages(conversation.messages),
          loading: false,
        });
      })
      .catch((err: ApiError) => this.handleApiError(err, this.retrieveMessages));
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
        <div className="ChatContainer" style={{width: WIDTH, maxHeight: HEIGHT}}>
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
          style={{width: WIDTH, maxHeight: HEIGHT}}
        >
          <WelcomeForm
            onPop={this.onPop}
            onDock={this.onDock}
            onMinimize={this.onMinimize}
            onFormSubmit={this.onWelcomeFormSubmit}
            onApiError={this.handleApiError}
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
        style={{width: WIDTH, maxHeight: HEIGHT}}
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
