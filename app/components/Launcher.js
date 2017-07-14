// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject, formatMessage} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import messages from 'messages';
import {isIEorSafari, displayError} from 'utils/utils';
import {noAgentsAvailableClass} from 'appConstants';
import type {IntlObject} from 'types';
import './styles/Launcher.scss';
import {getChatClient} from '../ChatClient';
import type {QuiqChatClientType} from 'quiq-chat';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
  chatOpen: boolean,
  initialized: boolean,
};

export type LauncherProps = {
  intl: IntlObject,
};

export class Launcher extends Component {
  props: LauncherProps;
  state: LauncherState = {
    chatOpen: false,
    initialized: false,
  };
  checkForAgentsInterval: number;
  client: QuiqChatClientType;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.client = getChatClient();
    if (QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0) {
      this.bindChatButtons();
    }

    this.checkForAgentsInterval = setInterval(this.checkForAgents, 1000 * 60);
    // Check the first time
    this.checkForAgents();

    this.handleAutoPop();
  }

  componentWillUnmount() {
    clearInterval(this.checkForAgentsInterval);
  }

  componentWillUpdate(nextProps: LauncherProps, nextState: LauncherState) {
    if (
      QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0 &&
      this.state.agentsAvailable !== nextState.agentsAvailable
    ) {
      this.updateCustomChatButtons(!!nextState.agentsAvailable);
    }
  }

  handleAutoPop = () => {
    if (!isIEorSafari() && typeof QUIQ.AUTO_POP_TIME === 'number') {
      setTimeout(() => {
        if (!this.state.chatOpen) {
          this.toggleChat(false);
        }
      }, QUIQ.AUTO_POP_TIME);
    }
  };

  checkForAgents = async () => {
    const chatClient = getChatClient();

    const {available} = await chatClient.checkForAgents();
    const activeChat = await chatClient.hasActiveChat();

    this.setState({
      agentsAvailable: activeChat || available,
    });

    if (chatClient.isChatVisible() && !this.state.chatOpen) {
      this.toggleChat(false);
    }
  };

  fireJoinLeaveEvent = async (fireEvent: boolean = true) => {
    if (!this.state.initialized) {
      await this.client.start();
      this.setState({initialized: true});
    }

    if (fireEvent) {
      this.state.chatOpen ? this.client.joinChat() : this.client.leaveChat();
    }
  };

  toggleChat = (fireEvent: boolean = true) => {
    if (isIEorSafari()) {
      return openStandaloneMode();
    }

    this.setState(
      prevState => ({chatOpen: !prevState.chatOpen}),
      () => this.fireJoinLeaveEvent(fireEvent),
    );
  };

  updateCustomChatButtons = (agentsAvailable: boolean) => {
    try {
      QUIQ.CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
        const ele = document.querySelector(selector);
        if (!ele) return displayError(messages.unableToFindCustomLauncherError);

        agentsAvailable
          ? ele.classList.remove(noAgentsAvailableClass)
          : ele.classList.add(noAgentsAvailableClass);
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToFindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  bindChatButtons = () => {
    try {
      QUIQ.CUSTOM_LAUNCH_BUTTONS.forEach((selector: string) => {
        const ele = document.querySelector(selector);
        if (!ele) return displayError(messages.unableToBindCustomLauncherError);

        ele.addEventListener('click', () => {
          this.toggleChat(true);
        });
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToBindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  render() {
    if (!this.state.agentsAvailable) return null;

    return (
      <div className="Launcher">
        <ChatContainer
          initialized={this.state.initialized}
          toggleChat={this.toggleChat}
          hidden={!this.state.chatOpen}
        />
        {QUIQ.CUSTOM_LAUNCH_BUTTONS.length === 0 &&
          <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />}
      </div>
    );
  }
}

export default injectIntl(Launcher);
