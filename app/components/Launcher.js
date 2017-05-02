// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import {supportsFlexbox, supportsSVG} from 'utils/utils';
import {joinChat, leaveChat, checkForAgents} from 'network/chat';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import NoAgentsAvailable from './NoAgentsAvailable';
import './styles/Launcher.scss';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
  chatOpen: boolean,
};

class Launcher extends Component {
  state: LauncherState = {
    chatOpen: false,
  };
  checkForAgentsInterval: number;

  componentDidMount() {
    // Start polling to check for agents available
    this.checkForAgentsInterval = setInterval(this.checkForAgents, 1000 * 60);
    // Check the first time
    this.checkForAgents();
  }

  componentWillUnmount() {
    clearInterval(this.checkForAgentsInterval);
  }

  checkForAgents = () => {
    checkForAgents().then(data => {
      this.setState({agentsAvailable: data.available});
    });
  };

  toggleChat = () => {
    this.setState(
      prevState => ({chatOpen: !prevState.chatOpen}),
      () => {
        this.state.chatOpen ? joinChat() : leaveChat();
      },
    );
  };

  renderChat = () => (
    <div>
      <ChatContainer hidden={!this.state.chatOpen} />
      <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />
    </div>
  );

  render() {
    const classNames = classnames('Launcher', {
      noFlexbox: !supportsFlexbox(),
      noSvg: !supportsSVG(),
    });

    let content;
    if (this.state.agentsAvailable === true) {
      content = this.renderChat();
    } else if (this.state.agentsAvailable === false) {
      content = <NoAgentsAvailable />;
    }

    return (
      <div className={classNames}>
        {content}
      </div>
    );
  }
}

export default Launcher;
