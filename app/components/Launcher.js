// @flow

import React, {Component} from 'react';
import {joinChat, leaveChat} from 'network/chat';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import './styles/Launcher.scss';

class Launcher extends Component {
  state = {
    chatOpen: false,
  };

  toggleChat = () => {
    this.setState(
      prevState => ({chatOpen: !prevState.chatOpen}),
      () => {
        this.state.chatOpen ? joinChat() : leaveChat();
      },
    );
  };
  render() {
    return (
      <div className="Launcher">
        <ChatContainer hidden={!this.state.chatOpen} />
        <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />
      </div>
    );
  }
}

export default Launcher;
