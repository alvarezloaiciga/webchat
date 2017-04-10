// @flow

import React, {Component} from 'react';
import classnames from 'classnames';
import { joinChat, leaveChat } from 'network/chat';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import './styles/Launcher.scss';

class Launcher extends Component {
  state = {
    chatOpen: false,
  };

  toggleChat = () => {
    this.setState(prevState => ({chatOpen: !prevState.chatOpen}), () => {
      this.state.chatOpen ? joinChat() : leaveChat();
    });
  }

  render() {
    return (
      <div className='Launcher'>
        <div className={ classnames({ hidden: !this.state.chatOpen }) }>
          <ChatContainer />
        </div>
        <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen}/>
      </div>
    );
  }
}

export default Launcher;
