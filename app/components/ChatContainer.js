// @flow

import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {fetchConversation, fetchWebsocketInfo, addMessage} from 'network/chat';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import WelcomeForm from 'WelcomeForm';
import QUIQ from 'utils/quiq';
import {isIE9} from 'utils/utils';
import {connectSocket} from 'network/atmosphere';
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

  componentWillReceiveProps(nextProps: ChatContainerProps) {
    // We reset poppedChat when user explicitly re-opens chat
    if (this.props.hidden && !nextProps.hidden) {
      this.setState({poppedChat: false});
    }
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

  getTextMessages = (msgs: Array<Message>) => msgs.filter(m => m.type === MessageTypes.TEXT);

  handleWebsocketMessage = (message: AtmosphereMessage) => {
    console.log(message);
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

  onWelcomeFormSubmit = (text: string) => {
    this.setState({
      welcomeForm: false,
    });

    if (text) {
      addMessage(text);
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

    const classNames = classnames('ChatContainer', {
      standaloneMode: QUIQ.STANDALONE_MODE,
    });

    /* eslint-disable no-unused-vars */
    const openChatInNewWindow = () => {
      const width = 400;
      const height = 600;
      const left = screen.width / 2 - width / 2;
      const top = screen.height / 2 - height / 2;

      window
        .open(
          `${QUIQ.HOST}/app/webchat/standalone`,
          isIE9() ? '_blank' : 'quiq-standalone-webchat',
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`,
        )
        .focus();

      if (this.props.toggleChat) {
        this.props.toggleChat();
        this.setState({
          poppedChat: true,
        });
      }
    };
    /* eslint-disable no-unused-vars */

    return (
      <div className={classNames}>
        <div className="banner" style={{backgroundColor: COLOR}}>
          <span className="messageUs">{HEADER_TEXT}</span>
          {/* <i
            className="fa fa-external-link openStandaloneMode"
            title={formatMessage(messages.openInNewWindow)}
            onClick={openChatInNewWindow}
          /> */}
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
