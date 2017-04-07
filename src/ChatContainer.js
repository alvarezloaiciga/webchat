import React, {Component} from 'react';
import './App.css';
import './loader.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {connectSocket, disconnectSocket} from './atmosphereService';
import {MessageTypes} from './Constants';

export class ChatContainer extends Component {
  state = {
    messages: [],
    tenant: undefined,
    contactPoint: undefined,
    host: 'centricient.com',
    color: '#59ad5d',
    headerText: "We're here to help if you have any questions!",
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
            this.handleWebsocketMessage));
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

  handleWebsocketMessage = (message) => {
    // TODO: Implement prettier handling of various types of websocket messages--text, agent typing, etc.
    // Currently, all CHAT_MESSAGE type messages are stored in the same array, and the render() method filters out the text
    // messages and displays them. Should look at this again down the road.

    if (message.messageType === MessageTypes.CHAT_MESSAGE) {
      this.setState(prevState => ({messages: [...prevState.messages, message.data]}));
    }
  };

  retrieveMessages = () => new Promise((resolve, reject) => {
    console.log('Initial message retrieval starting');
    const {tenant, contactPoint, host} = this.state;
    fetch(`https://${tenant}.${host}/api/v1/messaging/chat/${contactPoint}`, {
      mode: 'cors',
      credentials: 'include',
    }).then(_response => {
      _response.json().then(res => {
        if (res.status && res.status >= 300) {
          return reject();
        }
        // Update state, then resolve promise AFTER state update completes
        this.setState({messages: res.messages, userId: res.id}, resolve);
      });
    }).catch(() => {
      reject();
    });
  });

  addMessage = (body) => {
    const {tenant, contactPoint, host} = this.state;

    fetch(`https://${tenant}.${host}/api/v1/messaging/chat/${contactPoint}/send-message`, {
      mode: 'cors',
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({body}),
    }).then(response => {
      response.json().then(msg => {
        const newMessage = {
          id: msg.id,
          timestamp: msg.timestamp,
          body,
          type: 'Text',
          authorType: 'Guest',
        };
        this.setState(prevState => ({messages: [...prevState.messages, newMessage]}));
      })
    });
  }

  render() {
    const textMessages = this.state.messages.filter((m) => (m.type == MessageTypes.TEXT));
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
        <Transcript messages={textMessages} color={this.state.color}/>
        }

        {!this.state.loading && this.state.connected &&
        <MessageForm addMessage={this.addMessage} color={this.state.color}/>
        }
      </div>
    );
  }
}

export default ChatContainer;