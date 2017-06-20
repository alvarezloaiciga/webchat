// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'utils/i18n';
import QUIQ from 'utils/quiq';
import {joinChat, leaveChat, checkForAgents, fetchConversation} from 'quiq-chat';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import {last} from 'lodash';
import {quiqChatContinuationCookie} from 'appConstants';
import type {IntlObject} from 'types';
import './styles/Launcher.scss';
import {get} from 'js-cookie';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
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
      this.setState({chatOpen: !minimized});
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
    // quiq-chat-continuation is a cookie to tell if the user
    // already initiated a chat, and therefore should bypass the agent
    // availability check.
    if (get(quiqChatContinuationCookie.id)) {
      if (!this.state.agentsAvailable) {
        this.setState({agentsAvailable: true}, this.checkIfConversation);
      }

      return;
    }

    const data = await checkForAgents();
    this.setState({
      agentsAvailable: data.available,
    });
  };

  toggleChat = (fireEvent: boolean = true) => {
    this.setState(
      prevState => ({chatOpen: !prevState.chatOpen}),
      () => {
        if (fireEvent) {
          this.state.chatOpen ? joinChat() : leaveChat();
        }
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
    const content = this.state.agentsAvailable === true ? this.renderChat() : null;

    return (
      <div className="Launcher">
        {content}
      </div>
    );
  }
}

export default injectIntl(Launcher);
