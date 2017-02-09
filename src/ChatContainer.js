import React, {Component} from 'react';
import './App.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {getBacon} from './baconIpsum';

export class ChatContainer extends Component {
  state = {
    messages: [],
    tenant: undefined,
  };

  componentDidMount() {
    // setInterval(() => {
    //   // TODO: Need to know the URL we'd hit here
    //   fetch('http://localhost:3001/messages')
    //     .then(response => {
    //       response.json().then(messages => this.setState({messages}))
    //     })
    // }, 1000);
    
    window.addEventListener('message', this.handleTenantMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleTenantMessage, false);
  }

  handleTenantMessage = (event) => {
    const origin = event.origin || event.originalEvent.origin;
    console.log(origin);

    const tenant = event.data && event.data.tenant;
    if (tenant) {
      this.setState({tenant});
    }
  }

  addMessage = (text) => {
    // fetch('http://localhost:3001/message', {
    //   method: 'post',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({text}),
    // }).then(response => {
    //   response.json().then(msg => this.setState(prevState => ({messages: [...prevState.messages, msg]})))
    // });
    this.setState({messages: [...this.state.messages, {text, fromCustomer: true}]});

    setTimeout(() => {
      this.setState({messages: [...this.state.messages, {text: getBacon(), fromCustomer: false}]});
    }, 2000);
  }


  render() {
    return (
      <div className="chatContainer">
        <div className="banner">
          <span className="messageUs">
            We're here to help if you have any questions!
          </span>
          Tenant: {this.state.tenant}
        </div>
        <Transcript messages={this.state.messages}/>
        <MessageForm addMessage={this.addMessage}/>
      </div>
    );
  }
}

export default ChatContainer;
