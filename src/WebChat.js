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
  };

  toggleChat = () => {
    this.setState(prevState => ({chatOpen: !prevState.chatOpen}));
  }

  render() {
    return (
      <div style={bottomCorner}>
        {this.state.chatOpen &&
          <ChatContainer />
        }
        <ToggleChatButton toggleChat={this.toggleChat}/>
      </div>
    );
  }
}

export default WebChat;
