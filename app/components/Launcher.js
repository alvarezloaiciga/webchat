// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject, formatMessage} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import ChatContainer from './ChatContainer';
import ToggleChatButton from './ToggleChatButton';
import './styles/Launcher.scss';
import {setChatHidden, setChatPopped} from 'actions/chatActions';
import {getChatClient} from '../ChatClient';
import messages from 'messages';
import {displayError, isIEorSafari} from 'utils/utils';
import {noAgentsAvailableClass} from 'appConstants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import type {IntlObject, ChatState} from 'types';
import type {QuiqChatClientType} from 'quiq-chat';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  setChatHidden: (hidden: boolean) => void,
  setChatPopped: (popped: boolean) => void,
  hidden: boolean,
  popped: boolean,
};

export class Launcher extends Component {
  props: LauncherProps;
  state: LauncherState = {};
  checkForAgentsInterval: number;
  client: QuiqChatClientType;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.client = getChatClient();
    this.bindChatButtons();

    this.checkForAgentsInterval = setInterval(this.checkForAgents, 1000 * 60);
    // Check the first time
    this.checkForAgents();

    this.handleAutoPop();
  }

  componentWillUnmount() {
    clearInterval(this.checkForAgentsInterval);
  }

  handleAutoPop = () => {
    if (!isIEorSafari() && typeof QUIQ.AUTO_POP_TIME === 'number') {
      setTimeout(() => {
        this.props.setChatHidden(false);
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

    if (chatClient.isChatVisible()) {
      this.props.setChatHidden(false);
    }
  };

  componentWillUpdate(nextProps: LauncherProps, nextState: LauncherState) {
    if (
      QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0 &&
      this.state.agentsAvailable !== nextState.agentsAvailable
    ) {
      this.updateCustomChatButtons(!!nextState.agentsAvailable);
    }
  }

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

        ele.addEventListener('click', this.toggleChat);
      });
    } catch (e) {
      displayError(`${formatMessage(messages.unableToBindCustomLauncherError)}\n  ${e.message}`);
    }
  };

  toggleChat = () => {
    const client = getChatClient();

    if (this.props.popped || isIEorSafari()) {
      return openStandaloneMode({
        onPop: () => {
          this.props.setChatPopped(true);
          getChatClient().joinChat();
        },
        onFocus: () => {
          this.props.setChatPopped(true);
        },
        onDock: () => {
          this.props.setChatPopped(false);
        },
      });
    }

    if (this.props.hidden) {
      client.joinChat();
      this.props.setChatHidden(false);
      return;
    }

    client.leaveChat();
    this.props.setChatHidden(true);
  };

  render() {
    if (!this.state.agentsAvailable) return null;

    return (
      <div className="Launcher">
        <ChatContainer />
        {QUIQ.CUSTOM_LAUNCH_BUTTONS.length === 0 &&
          <ToggleChatButton toggleChat={this.toggleChat} />}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state: ChatState) => ({
      hidden: state.hidden,
      popped: state.popped,
    }),
    {setChatHidden, setChatPopped},
  ),
)(Launcher);
