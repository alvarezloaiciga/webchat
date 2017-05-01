// @flow
declare var Modernizr: Object;
import 'modernizr';
import React, {Component} from 'react';
import classnames from 'classnames';
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
      flexbox: Modernizr.flexbox,
      noFlexbox: !Modernizr.flexbox,
      svg: Modernizr.svg,
      noSvg: !Modernizr.svg,
      flexwrap: Modernizr.flexwrap,
      noFlexwrap: !Modernizr.flexwrap,
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
