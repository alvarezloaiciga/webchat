import React, {Component} from 'react';
import './App.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {getBacon} from './baconIpsum';

export class ChatContainer extends Component {
  state = {
    messages: [],
    tenant: undefined,
    endpoint: undefined,
    chatConfigured: false,
  };

  poll;

  componentDidMount() {
    window.addEventListener('message', this.handleTenantMessage, false);
  }

  componentWillUnmount() {
    this.endPolling();
    window.removeEventListener('message', this.handleTenantMessage, false);
  }

  handleTenantMessage = (event) => {
    const origin = event.origin || event.originalEvent.origin;
    console.log(origin, event.data);

    const tenant = event.data && event.data.tenant;
    const endpoint = event.data && event.data.endpoint;
    if (tenant && endpoint) {
      this.setState({tenant, endpoint, chatConfigured: true});
      this.startPolling();
    }
  }

  startPolling = () => {
    this.poll = setInterval(() => {
      console.log('polling');
      const {tenant, endpoint} = this.state;
      fetch(`https://${tenant}.centricient.corp/api/v1/webchat/endpoints/${endpoint}`, {
        mode: 'cors',
        credentials: 'include',
      }).then(response => {
          response.json().then(chat => {
            this.setState({messages: chat.messages});
          })
        })
    }, 1000);
  }

  endPolling = () => {
    clearInterval(this.poll);
  }

  addMessage = (text) => {
    const {tenant, endpoint} = this.state;
    fetch(`https://${tenant}.centricient.corp/api/v1/webchat/endpoints/${endpoint}`, {
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
        this.setState(prevState => ({messages: [...prevState.messages, newMessage]}))
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
          <div>
            Tenant: {this.state.tenant}
          </div>
          <div>
            Endpoint: {this.state.endpoint}
          </div>
        </div>
        <Transcript messages={this.state.messages}/>
        <MessageForm addMessage={this.addMessage}/>
      </div>
    );
  }
}

export default ChatContainer;
