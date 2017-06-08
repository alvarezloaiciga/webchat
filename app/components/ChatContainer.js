// @flow
import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {addMessage, subscribe, fetchConversation} from 'quiq-chat';
import {formatMessage} from 'utils/i18n';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import WelcomeForm from 'WelcomeForm';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {inStandaloneMode} from 'utils/utils';
import {MessageTypes} from 'appConstants';
import messages from 'messages';
import classnames from 'classnames';
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
  toggleChat?: () => void,
};

const {COLOR, HEADER_TEXT} = QUIQ;

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
  windowTimer: ?number;
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
      subscribe({
        onConnectionLoss: this.disconnect,
        onConnectionEstablish: this.onConnectionEstablish,
        onMessage: this.handleWebsocketMessage,
      });

      const conversation = await fetchConversation();
      this.setState({messages: this.getTextMessages(conversation.messages)});
    } catch (err) {
      this.handleApiError(err, this.initialize);
    }
  };

  componentDidMount() {
    if (!this.state.connected) {
      this.initialize();
    }
  }

  componentWillReceiveProps(nextProps: ChatContainerProps) {
    // We reset poppedChat when user explicitly re-opens chat
    if (this.props.hidden && !nextProps.hidden) {
      this.setState({poppedChat: false});
    }
  }

  componentWillUnmount() {
    if (this.windowTimer) clearInterval(this.windowTimer);
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  connect = () => {
    this.setState({connected: true});
  };

  disconnect = () => {
    this.setState({connected: false});
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
          this.appendMessageToChat(message.data);

          // If we popped webchat in standalone mode, and user hasn't explicitly clicked chat button again,
          // don't open it.
          if (this.props.onMessage && !this.state.poppedChat) {
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

  onWelcomeFormSubmit = (text: string) => {
    this.setState({
      welcomeForm: false,
    });

    if (text) {
      addMessage(text);
    }
  };

  onPop = () => {
    if (this.props.toggleChat) {
      this.props.toggleChat();
      this.setState({
        poppedChat: true,
      });
    }
  };

  minimizeChat = () => {
    if (this.props.toggleChat && !this.props.hidden) {
      this.props.toggleChat();
    }
  };

  maximizeChat = () => {
    if (this.props.toggleChat && this.props.hidden) {
      this.props.toggleChat();
    }
  };

  onDock = () => {
    this.maximizeChat();
    this.setState({
      poppedChat: false,
    });
  };

  render() {
    if (this.props.hidden) return null;

    if (this.state.welcomeForm && !this.state.loading && !this.state.messages.length) {
      return (
        <div className="ChatContainer">
          <WelcomeForm onFormSubmit={this.onWelcomeFormSubmit} />
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div className="ChatContainer">
          <div className="errorBanner">
            <FormattedMessage {...messages.errorState} />
          </div>
        </div>
      );
    }

    return (
      <div
        className={classnames('ChatContainer', {
          standaloneMode: inStandaloneMode(),
        })}
      >
        <HeaderMenu onPop={this.onPop} onDock={this.onDock} onMinimize={this.minimizeChat} />
        <div className="banner" style={{backgroundColor: COLOR}}>
          <span className="messageUs">{HEADER_TEXT}</span>
        </div>

        {!this.state.connected &&
          !this.state.loading &&
          <div className="errorBanner">
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
