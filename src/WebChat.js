import React, {Component} from 'react';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import {getBacon} from './baconIpsum';
import fetch from 'isomorphic-fetch';

const bottomCorner = {
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: 1000000,
};

class WebChat extends Component {
  state = {
    chatOpen: false,
    messages: [],
  };

  componentDidMount() {
    setInterval(() => {
      // TODO: Need to know the URL we'd hit here
      fetch('http://localhost:3001/messages')
        .then(response => {
          response.json().then(messages => this.setState({messages}))
        })
    }, 1000);
  }

  addMessage = (text) => {
    fetch('http://localhost:3001/message', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text}),
    }).then(response => {
      response.json().then(msg => this.setState(prevState => ({messages: [...prevState.messages, msg]})))
    });
  }

  toggleChat = () => {
    this.setState(prevState => ({chatOpen: !prevState.chatOpen}));
  }

  render() {
    return (
      <div style={bottomCorner}>
        {this.state.chatOpen &&
          <ChatContainer messages={this.state.messages} addMessage={this.addMessage}/>
        }
        <ToggleChatButton toggleChat={this.toggleChat}/>
      </div>
    );
  }
}

export default WebChat;
