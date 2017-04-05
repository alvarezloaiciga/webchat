import React, {Component} from 'react';
import './App.css';
import './loader.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {connectSocket, disconnectSocket} from './atmosphereService';
import {MessageTypes} from './Constants';

export class ChatContainer extends Component {
  state = {
    messages: {},
    tenant: undefined,
    contactPoint: undefined,
    host: 'centricient.com',
    color: '#59ad5d',
    headerText: "We're here to help if you have any questions!",
    chatConfigured: false,
    userId: undefined,
    loading: true,
    connected: false,
  };

  componentDidMount() {
    window.addEventListener('message', this.handleWindowMessage, false);
  }

  componentWillUnmount() {
    disconnectSocket();
    window.removeEventListener('message', this.handleWindowMessage, false);
  }

  handleWindowMessage = (event) => {
    // Contents of event.data: tenant, contactPoint, host, color, headerText

    const newState = Object.assign({}, this.state, {...event.data});

    this.setState(newState, () => {
      const {tenant, contactPoint, host} = this.state;

      if (tenant && contactPoint && host) {
        // Retrieve initial messages and userId, then connect to socket
        this.retrieveMessages().then(
          () => connectSocket(tenant,
            contactPoint,
            host,
            this.state.userId,
            this.onConnectionLoss,
            this.onConnectionEstablish,
            this.handleMessage));
      }
    });
  }

  onConnectionEstablish = () => {
    this.setState({connected: true});

    // Retrieve messages (some may have come in during socket connect)
    this.retrieveMessages().then(() => {
      // This will set get rid of the 'loading' status the first time we connect and retrieve messages
      this.setState({loading: false});
    });
  };

  onConnectionLoss = () => {
    this.setState({connected: false});
  };

  handleMessage = (message) => {
    if (message.messageType == MessageTypes.CHAT_MESSAGE) {
      switch (message.data.type) {
        case MessageTypes.TEXT:
          this.setState(prevState => ({messages: {...prevState.messages, [message.data.id]: message.data}}));
          break;
        default:
          console.log("Quiq: unknown websocket messageType received");
      }
    }
  };

  retrieveMessages = () => new Promise((resolve) => {
    console.log('Initial message retrieval starting');
    const {tenant, contactPoint, host} = this.state;
    fetch(`https://${tenant}.${host}/api/v1/webchat/endpoints/${contactPoint}`, {
      mode: 'cors',
      credentials: 'include',
    }).then(response => {
      response.json().then(chat => {
        const messages = chat.messages.reduce((prev, cur) => ({...prev, [cur.id]: cur}), {});

        // Update state, then resolve promise AFTER state update completes
        this.setState({messages: messages, userId: chat.id}, resolve);
      });
    });
  });

  addMessage = (text) => {
    const {tenant, contactPoint, host} = this.state;

    fetch(`https://${tenant}.${host}/api/v1/webchat/endpoints/${contactPoint}`, {
      mode: 'cors',
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({type: 'Text', body: text}),
    }).then(response => {
      response.json().then(msg => {
        const newMessage = {
          id: msg.id,
          timestamp: msg.timestamp,
          body: text,
          type: 'Text',
          authorType: 'Guest',
        };
        this.setState(prevState => ({messages: {...prevState.messages, [newMessage.id]: newMessage}}));
      })
    });
  }

  render() {
    return (
      <div className="chatContainer">
        <div className="banner" style={{backgroundColor: this.state.color}}>
          <span className="messageUs">
            {this.state.headerText}
          </span>
        </div>

        {!this.state.connected && !this.state.loading &&
        <div className="error-banner">
          Reconnecting...
        </div>
        }

        {this.state.loading &&
        <div className="loader-wrapper">
          <div className="loader" style={{borderColor: this.state.color}}>
            Connecting...
          </div>
        </div>
        }

        {!this.state.loading &&
        <Transcript messages={this.state.messages} color={this.state.color}/>
        }

        {!this.state.loading && this.state.connected &&
        <MessageForm addMessage={this.addMessage} color={this.state.color}/>
        }
      </div>
    );
  }
}

export default ChatContainer;