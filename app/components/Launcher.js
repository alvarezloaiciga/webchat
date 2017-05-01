// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import {supportsFlexbox, supportsSVG} from 'utils/utils';
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
    const classNames = classnames('Launcher', {
      noFlexbox: !supportsFlexbox(),
      noSvg: !supportsSVG(),
    });
    return (
      <div className={classNames}>
        <ChatContainer hidden={!this.state.chatOpen} />
        <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />
      </div>
    );
  }
}

export default Launcher;
