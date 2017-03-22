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
    this.setupDevFallback();
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

  // TODO: Remove this
  setupDevFallback = () => {
    setTimeout(() => {
      if (!this.state.chatConfigured) {
        this.setState(
          {tenant: 'nate.dev', endpoint: 'prototype'},
          () => this.startPolling()
        );
      }
    }, 2000)
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
          // response.json().then(messages => console.log(messages))
        })
    }, 10000); // TODO: Switch this to a smaller time
  }

  endPolling = () => {
    clearInterval(this.poll);
  }

  // TODO: Get this calling the API correctly
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
      response.json().then(msg => this.setState(prevState => ({messages: [...prevState.messages, msg]})))
    });
    // this.setState({messages: [...this.state.messages, {text, fromCustomer: true}]});

    // setTimeout(() => {
    //   this.setState({messages: [...this.state.messages, {text: getBacon(), fromCustomer: false}]});
    // }, 2000);
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
