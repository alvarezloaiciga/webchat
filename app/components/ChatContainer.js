// @flow

import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import { retrieveMessages } from 'network/chat';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import { QUIQ } from 'utils/utils';
import { connectSocket } from 'network/atmosphere';
import { MessageTypes } from 'appConstants';
import messages from 'messages';
import type { Message, Conversation, AtmosphereMessage } from 'types';

import './styles/ChatContainer.scss';

type ChatContainerState = {
  messages: Array<Message>,
  userId?: string,
  connected: boolean,
  loading: boolean,
};

const { COLOR, HEADER_TEXT } = QUIQ;

export class ChatContainer extends Component {
  state: ChatContainerState = {
    messages: [],
    connected: false,
    loading: true,
  };

  componentDidMount() {
    if (!this.state.connected) {
      this.retrieveMessages(this.connectWebsocket);
    }
  }

  connect = () => { this.setState({ connected: true }); }
  disconnect = () => { this.setState({ connected: false }); }
  loading = () => { this.setState({ loading: true }); }
  notLoading = () => { this.setState({ loading: false }); }

  connectWebsocket = (userId: string) => {
    connectSocket({
      userId,
      options: {
        onConnectionLoss: this.disconnect,
        onConnectionEstablish: this.onConnectionEstablish,
        handleMessage: this.handleWebsocketMessage,
      },
    });
  }

  onConnectionEstablish = () => {
    this.connect();
    this.retrieveMessages(this.notLoading);
  };

  getTextMessages = (msgs: Array<Message>) => msgs.filter((m) => (m.type === MessageTypes.TEXT));

  handleWebsocketMessage = (message: AtmosphereMessage) => {
    if (message.messageType === MessageTypes.CHAT_MESSAGE) {
      this.appendMessageToChat(message.data);
    }
  };


  retrieveMessages = (onMessagesRetrieved: (userId: string) => void) => {
    retrieveMessages((conversation: Conversation, resolve: () => void) => {
      this.setState({messages: this.getTextMessages(conversation.messages)}, resolve);
      onMessagesRetrieved(conversation.id);
    });
  }

  appendMessageToChat = (message: Message) => {
    if (message.type !== 'Text') return;

    if (!this.state.messages.some((m) => (m.id === message.id))) {
      this.setState(prevState => ({messages: [...prevState.messages, message]}));
    }
  }

  render() {
    return (
      <div className="ChatContainer">
        <div className="banner" style={{ backgroundColor: COLOR }}>
          <span className="messageUs">{ HEADER_TEXT }</span>
        </div>

        { !this.state.connected && !this.state.loading &&
          <div className="errorBanner">
            <FormattedMessage {...messages.reconnecting} />
          </div>
        }

        { this.state.loading ?
          <Spinner /> :
          <Transcript messages={ this.state.messages } />
        }

        { !this.state.loading && this.state.connected &&
          <MessageForm />
        }
      </div>
    );
  }
}

export default ChatContainer;
