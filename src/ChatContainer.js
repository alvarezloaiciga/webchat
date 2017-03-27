import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './App.css';
import './loader.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {getBacon} from './baconIpsum';
import {connectSocket, disconnectSocket} from './atmosphereService';

export class ChatContainer extends Component {
  state = {
    messages: {},
    tenant: undefined,
    endpoint: undefined,
    host: undefined,
    color: undefined,
    chatConfigured: false,
    userId: undefined,
    loading: true,
    connected: false,
  };

  componentDidMount() {
    this.handleTenantMessage({
      data: {
        endpoint: 'prototype',
        tenant: 'fred',
        host: 'dev.centricient.corp'
      },
      origin: {}
    });
    window.addEventListener('message', this.handleTenantMessage, false);
  }

  componentWillUnmount() {
    disconnectSocket();
    window.removeEventListener('message', this.handleTenantMessage, false);
  }

  handleTenantMessage = (event) => {
    const origin = event.origin || event.originalEvent.origin;
    console.log(origin, event.data);

    const tenant = event.data && event.data.tenant;
    const endpoint = event.data && event.data.endpoint;
    const host = event.data && event.data.host;
    if (tenant && endpoint && host) {
      this.setState({tenant, endpoint, host, chatConfigured: true}, () => {
        // Retrieve initial messages and userId, then connect to socket
        this.retrieveMessages().then(
          () => connectSocket(tenant,
            endpoint,
            host,
            this.state.userId,
            this.onConnectionLoss,
            this.onConnectionEstablish,
            this.handleMessage));
      });
    }
  };

  onConnectionEstablish = () => {
    this.setState({connected: true});
    this.retrieveMessages().then(() => {
      // This will set get rid of the 'loading' status the first time we connect and retrieve messages
      this.setState({loading: false});
    });
  };

  onConnectionLoss = () => {
    this.setState({connected: false});
  };

  handleMessage = (message) => {
    switch (message.messageType) {
      case 'ChatMessage':
        this.setState(prevState => ({messages: {...prevState.messages, [message.data.id]: message.data}}));
        break;
      default:
        console.log("Quiq: unknown websocket messageType received");
    }
  };

  retrieveMessages = () => new Promise((resolve) => {
    console.log('Initial message retrieval starting');
    const {tenant, endpoint, host} = this.state;
    fetch(`https://${tenant}.${host}/api/v1/webchat/endpoints/${endpoint}`, {
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
    const {tenant, endpoint, host} = this.state;

    fetch(`https://${tenant}.${host}/api/v1/webchat/endpoints/${endpoint}`, {
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
        <div className="banner">
          <span className="messageUs">
            We're here to help if you have any questions!
          </span>
        </div>

        {!this.state.connected && !this.state.loading &&
          <div className="error-banner">
            Reconnecting...
          </div>
        }

        {this.state.loading &&
          <div className="loader-wrapper">
            <div className="loader">
              Connecting...
            </div>
          </div>
        }

        {!this.state.loading &&
          <Transcript messages={this.state.messages}/>
        }

        {!this.state.loading && this.state.connected &&
          <MessageForm addMessage={this.addMessage} />
        }
      </div>
    );
  }
}

export default ChatContainer;
