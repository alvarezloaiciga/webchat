// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'utils/i18n';
import QUIQ from 'utils/quiq';
import {joinChat, leaveChat, checkForAgents, fetchConversation} from 'quiq-chat';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import NoAgentsAvailable from './NoAgentsAvailable';
import {last} from 'lodash';
import type {IntlObject} from 'types';
import './styles/Launcher.scss';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
  chatStarted?: boolean, // Undefined means we're still looking it up
  chatOpen: boolean,
};

export type LauncherProps = {
  intl: IntlObject,
};

export class Launcher extends Component {
  props: LauncherProps;
  state: LauncherState = {
    chatOpen: false,
  };
  checkForAgentsInterval: number;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    // Start polling to check for agents available
    this.checkForAgentsInterval = setInterval(this.checkForAgents, 1000 * 60);
    // Check the first time
    this.checkForAgents();

    this.handleAutoPop();

    this.checkIfConversation();
  }

  componentWillUnmount() {
    clearInterval(this.checkForAgentsInterval);
  }

  checkIfConversation = async () => {
    const conversation = await fetchConversation();
    if (conversation && conversation.messages.length) {
      const lastStatusMessage = last(
        conversation.messages.filter(m => m.type === 'Join' || m.type === 'Leave'),
      );
      const minimized = lastStatusMessage && lastStatusMessage.type === 'Leave';
      this.setState({chatStarted: true, chatOpen: !minimized});
    }
  };

  handleAutoPop = () => {
    if (typeof QUIQ.AUTO_POP_TIME === 'number') {
      setTimeout(() => {
        this.setState({chatOpen: true});
      }, QUIQ.AUTO_POP_TIME);
    }
  };

  checkForAgents = async () => {
    // If agents are available or there is a conversation in progress, show the chat
    // Otherwise, show a placeholder that no one is available
    const [data, conversation] = await Promise.all([checkForAgents(), fetchConversation()]);
    this.setState({
      agentsAvailable: data.available,
      chatStarted: conversation && conversation.messages.length,
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

  handleMessage = () => {
    if (!this.state.chatOpen) {
      this.toggleChat();
    }
  };

  renderChat = () =>
    <div>
      <ChatContainer
        toggleChat={this.toggleChat}
        onMessage={this.handleMessage}
        hidden={!this.state.chatOpen}
      />
      <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />
    </div>;

  render() {
    let content;
    if (this.state.agentsAvailable === true || this.state.chatStarted) {
      content = this.renderChat();
    } else if (this.state.agentsAvailable === false) {
      content = <NoAgentsAvailable />;
    }

    return (
      <div className="Launcher">
        {content}
      </div>
    );
  }
}

export default injectIntl(Launcher);
