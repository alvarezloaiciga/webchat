// @flow
import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import Spinner from 'Spinner';
import MessageForm from 'MessageForm';
import Transcript from 'Transcript';
import WelcomeForm from 'WelcomeForm';
import QUIQ, {validateWelcomeFormDefinition} from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {inStandaloneMode} from 'utils/utils';
import messages from 'messages';
import classnames from 'classnames';
import {getChatClient} from '../ChatClient';
import type {Message, ApiError} from 'types';

import './styles/ChatContainer.scss';

type ChatContainerState = {
  messages: Array<Message>,
  connected: boolean,
  error: boolean,
  agentTyping: boolean,
  welcomeForm: boolean,
  poppedChat: boolean,
};

export type ChatContainerProps = {
  hidden?: boolean,
  initialized: boolean,
  toggleChat?: (fireEvent?: boolean) => void,
};

const {COLOR, HEADER_TEXT, FONT_FAMILY, WIDTH, HEIGHT} = QUIQ;

export class ChatContainer extends Component {
  props: ChatContainerProps;
  state: ChatContainerState = {
    messages: [],
    connected: false,
    error: false,
    agentTyping: false,
    welcomeForm: !!QUIQ.WELCOME_FORM,
    poppedChat: false,
  };
  typingTimeout: ?number;

  handleChatError = () => {
    this.setState({error: true});
  };

  handleChatErrorResolved = () => {
    this.setState({error: false});
  };

  handleApiError = (err?: ApiError, retry?: () => ?Promise<*>) => {
    if (err && err.status && err.status > 404) {
      if (retry) {
        setTimeout(retry, 5000);
      }
    } else {
      this.setState({error: true});
    }
  };

  componentDidMount() {
    // Validate WELCOME_FORM definition
    validateWelcomeFormDefinition();

    getChatClient()
      .onNewMessages(this.handleNewMessages)
      .onAgentTyping(this.handleAgentTyping)
      .onConnectionStatusChange(this.handleConnectivityChange)
      .onError(this.handleChatError)
      .onErrorResolved(this.handleChatErrorResolved)
      .onBurn(this.errorOut);
  }

  componentWillReceiveProps(nextProps: ChatContainerProps) {
    // We reset poppedChat when user explicitly re-opens chat
    if (this.props.hidden && !nextProps.hidden) {
      this.setState({poppedChat: false});
    }
  }

  componentWillUnmount() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  handleConnectivityChange = (connected: boolean) => {
    this.setState({connected});
  };

  /**
   * Triggered from a BurnItDown message.
   * This means the chat is in a fatal state and will need to be reloaded
   */
  errorOut = () => {
    this.setState({
      connected: false,
      error: true,
    });
  };

  handleAgentTyping = (typing: boolean) => {
    if (typing) this.startAgentTyping();
    else this.stopAgentTyping();
  };

  handleNewMessages = (incomingMessages: Array<Message>) => {
    const newMessages = incomingMessages.filter(n => !this.state.messages.some(m => n.id === m.id));
    this.setState(prevState => ({messages: [...prevState.messages, ...newMessages]}));
  };

  startAgentTyping = () => {
    // Clear the previous timeout if there was one
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.setState({agentTyping: true});
    this.typingTimeout = setTimeout(this.stopAgentTyping.bind(this), 10000);
  };

  stopAgentTyping = () => {
    this.setState({agentTyping: false});
  };

  onWelcomeFormSubmit = () => {
    this.setState({
      welcomeForm: false,
    });
  };

  onPop = (fireEvent: boolean) => {
    if (this.props.toggleChat) {
      this.props.toggleChat(fireEvent);
      this.setState({
        poppedChat: true,
      });
    }
  };

  onMinimize = (fireEvent: boolean) => {
    if (this.props.toggleChat && !this.props.hidden) {
      this.props.toggleChat(fireEvent);
    }
  };

  maximizeChat = (fireEvent: boolean) => {
    if (this.props.toggleChat && this.props.hidden) {
      this.props.toggleChat(fireEvent);
    }
  };

  onDock = (fireEvent: boolean) => {
    this.maximizeChat(fireEvent);
    this.setState({poppedChat: false});
  };

  getBanner = () => {
    if (this.state.error) {
      return (
        <div className="errorBanner">
          <FormattedMessage {...messages.errorState} />
        </div>
      );
    } else if (!this.state.connected && this.props.initialized) {
      return (
        <div className="errorBanner" style={{fontFamily: FONT_FAMILY}}>
          <FormattedMessage {...messages.reconnecting} />
        </div>
      );
    }

    return (
      <div className="banner" style={{backgroundColor: COLOR}}>
        <span className="messageUs" style={{fontFamily: FONT_FAMILY}}>
          {HEADER_TEXT}
        </span>
      </div>
    );
  };

  render() {
    if (this.props.hidden) return null;

    const classNames = classnames('ChatContainer', {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0,
    });

    if (
      this.state.welcomeForm &&
      this.props.initialized &&
      !this.state.messages.length &&
      !getChatClient().isRegistered()
    ) {
      return (
        <div className={classNames} style={{width: WIDTH, maxHeight: HEIGHT}}>
          <WelcomeForm
            onPop={this.onPop}
            onDock={this.onDock}
            onMinimize={this.onMinimize}
            onFormSubmit={this.onWelcomeFormSubmit}
            onApiError={this.handleApiError}
          />
        </div>
      );
    }

    return (
      <div className={classNames} style={{width: WIDTH, maxHeight: HEIGHT}}>
        <HeaderMenu onPop={this.onPop} onDock={this.onDock} onMinimize={this.onMinimize} />
        {this.getBanner()}
        <div className="chatContainerBody">
          {this.props.initialized ? <Transcript messages={this.state.messages} /> : <Spinner />}
          {this.props.initialized &&
            this.state.connected &&
            <MessageForm agentTyping={this.state.agentTyping} />}
        </div>
      </div>
    );
  }
}

export default ChatContainer;
