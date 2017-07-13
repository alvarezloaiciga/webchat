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
    if (QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0) {
      this.bindChatButtons();
    }
    // Start polling to check for agents available
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
    if (typeof QUIQ.AUTO_POP_TIME === 'number') {
      setTimeout(() => {
        // We don't update the quiq-chat-visible cookie here, since it wasn't a user action.
        this.setState({chatOpen: true});
      }, QUIQ.AUTO_POP_TIME);
    }
  };

  checkForAgents = async () => {
    const chatClient = getChatClient();

    const {available} = await chatClient.checkForAgents();
    const activeChat = await chatClient.hasActiveChat();
    this.setState({
      agentsAvailable: activeChat || available,
      chatOpen: chatClient.isChatVisible(),
    });
  };

  toggleChat = (fireEvent: boolean = true) => {
    const chatClient = getChatClient();

    if (isIEorSafari()) {
      return openStandaloneMode();
    }

    this.setState(
      prevState => ({chatOpen: !prevState.chatOpen}),
      () => {
        if (fireEvent) {
          this.state.chatOpen ? chatClient.joinChat() : chatClient.leaveChat();
        }
      },
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

        ele.onclick = this.toggleChat;
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToBindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  renderChat = () =>
    <div>
      <ChatContainer toggleChat={this.toggleChat} hidden={!this.state.chatOpen} />
      {QUIQ.CUSTOM_LAUNCH_BUTTONS.length === 0 &&
        <ToggleChatButton toggleChat={this.toggleChat} chatOpen={this.state.chatOpen} />}
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
