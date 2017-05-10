// @flow

import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {fetchConversation, fetchWebsocketInfo, addMessage} from 'network/chat';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import WelcomeForm from 'WelcomeForm';
import QUIQ from 'utils/quiq';
import {connectSocket} from 'network/atmosphere';
import {MessageTypes} from 'appConstants';
import messages from 'messages';
import type {Message, Conversation, AtmosphereMessage, ApiError} from 'types';

import './styles/ChatContainer.scss';

type ChatContainerState = {
  messages: Array<Message>,
  connected: boolean,
  loading: boolean,
  error: boolean,
  agentTyping: boolean,
  welcomeForm: boolean,
};

export type ChatContainerProps = {
  hidden: boolean,
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
  };

  handleApiError = (err?: ApiError, retry?: () => void) => {
    if (err && err.status && err.status > 404) {
      if (retry) {
        setTimeout(retry, 5000);
      }
    } else {
      this.setState({error: true});
    }
  };
  initialize = () => {
    let socketUrl;

    fetchWebsocketInfo()
      .then((response: {url: string}) => {
        socketUrl = response.url;
      })
      .then(fetchConversation)
      .then((conversation: Conversation) => {
        this.setState({messages: this.getTextMessages(conversation.messages)});
        connectSocket({
          socketUrl,
          options: {
            onConnectionLoss: this.disconnect,
            onConnectionEstablish: this.onConnectionEstablish,
            handleMessage: this.handleWebsocketMessage,
          },
        });
      })
      .catch((err: ApiError) => this.handleApiError(err, this.initialize));
  };
  componentDidMount() {
    if (!this.state.connected) {
      this.initialize();
    }
  }

  connect = () => {
    this.setState({connected: true});
  };
  disconnect = () => {
    this.setState({connected: false});
  };
  setLoading = () => {
    this.setState({loading: true});
  };
  notLoading = () => {
    this.setState({loading: false});
  };
  onConnectionEstablish = () => {
    this.connect();
    this.retrieveMessages(this.notLoading);
  };

  getTextMessages = (msgs: Array<Message>) => msgs.filter(m => m.type === MessageTypes.TEXT);

  handleWebsocketMessage = (message: AtmosphereMessage) => {
    console.log(message);
    if (message.messageType === MessageTypes.CHAT_MESSAGE) {
      switch (message.data.type) {
        case 'Text':
          this.appendMessageToChat(message.data);
          break;
        case 'AgentTyping':
          this.setState({agentTyping: message.data.typing});
          break;
      }
    }
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
  appendMessageToChat = (message: Message) => {
    if (message.type !== 'Text') return;

    if (!this.state.messages.some(m => m.id === message.id)) {
      this.setState(prevState => ({messages: [...prevState.messages, message]}));
    }
  };

  onWelcomeFormSubmit = (body: string) => {
    this.setState({
      welcomeForm: false,
    });

    if (body) {
      addMessage(body);
    }
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
      <div className="ChatContainer">
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
