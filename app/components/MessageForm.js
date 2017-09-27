// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {compatibilityMode, supportsFlexbox} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {messageTypes} from 'Common/Constants';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import './styles/MessageForm.scss';
import type {ChatState} from 'Common/types';

const {colors, fontFamily, styles} = quiqOptions;

export type MessageFormProps = {
  agentTyping: boolean,
  agentEndedConversation: boolean,
  agentsInitiallyAvailable?: boolean,
};

type MessageFormState = {
  text: string,
  agentsAvailable: boolean,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: any;
  props: MessageFormProps;
  state: MessageFormState = {
    text: '',
    agentsAvailable: true,
  };
  checkAvailabilityTimer: number;

  checkAvailability = async () => {
    if (quiqOptions.checkAgentsAvailability) {
      const available = await QuiqChatClient.checkForAgents();

      this.setState({agentsAvailable: available.available});
      clearTimeout(this.checkAvailabilityTimer);
      this.checkAvailabilityTimer = setTimeout(
        this.checkAvailability,
        quiqOptions.agentsAvailableTimer,
      );
    }
  };

  componentWillUnmount() {
    clearTimeout(this.checkAvailabilityTimer);
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.textArea) {
        this.textArea.focus();
      }
    }, 200);

    if (
      (!this.props.agentsInitiallyAvailable && !QuiqChatClient.isUserSubscribed()) ||
      this.props.agentEndedConversation
    ) {
      this.checkAvailability();
    }
  }

  componentWillUpdate(nextProps: MessageFormProps) {
    if (!this.props.agentEndedConversation && nextProps.agentEndedConversation) {
      this.checkAvailability();
    }
  }

  startTyping = () => {
    QuiqChatClient.updateMessagePreview(this.state.text, true);
    updateTimer = undefined;
  };

  stopTyping = () => {
    QuiqChatClient.updateMessagePreview(this.state.text, false);
  };

  startTypingTimers = () => {
    if (!updateTimer) {
      updateTimer = setTimeout(this.startTyping, 2000);
    }
  };

  resetTypingTimers = () => {
    clearTimeout(updateTimer);
    updateTimer = undefined;
    this.stopTyping();
  };

  handleTextChanged = (e: SyntheticInputEvent<*>) => {
    const state = Object.assign({
      text: e.target.value,
      agentsAvailable: true,
    });

    // This can get raised in IE 11 and in automation even if text hasn't been
    // entered. So ignore if we are in the agents not available state, or if the
    // text hasn't actually changed.
    if (this.state.agentsAvailable && state.text !== this.state.text) {
      clearTimeout(this.checkAvailabilityTimer);

      this.setState(state, e.target.value ? this.startTypingTimers : this.resetTypingTimers);
    }
  };

  addMessage = () => {
    const text = this.state.text.trim();
    if (text) {
      this.setState({text: ''}, this.resetTypingTimers);
      QuiqChatClient.sendMessage(text);
    }
  };

  handleKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.keyCode === keycodes.enter) {
      e.preventDefault();
      this.addMessage();
    }
  };

  render() {
    const sendDisabled = this.state.text.trim() === '' || !this.state.agentsAvailable;
    const compatMode = compatibilityMode();
    const messagePlaceholder = this.state.agentsAvailable
      ? getMessage(messageTypes.messageFieldPlaceholder)
      : getMessage(messageTypes.agentsNotAvailableMessage);

    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const buttonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      opacity: sendDisabled ? '.5' : '1',
      fontFamily,
    });

    return (
      <div className="MessageForm" style={getStyle(styles.MessageForm)}>
        {(!supportsFlexbox() || this.props.agentTyping) && (
          <div className="poke">
            {this.props.agentTyping && (
              <div className="pokeBody">
                <span style={{fontFamily}}>{getMessage(messageTypes.agentTypingMessage)}</span>
                <TypingIndicator yScale={0.5} xScale={0.75} />
              </div>
            )}
          </div>
        )}

        {(!supportsFlexbox() || this.props.agentEndedConversation) && (
          <div className="poke">
            {this.props.agentEndedConversation && (
              <div className="pokeBody">
                <span style={{fontFamily}}>
                  {getMessage(messageTypes.agentEndedConversationMessage)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="messageArea">
          <Textarea
            inputRef={n => {
              this.textArea = n;
            }}
            style={inputStyle}
            disabled={!this.state.agentsAvailable}
            name="message"
            value={this.state.text}
            maxLength={1024}
            maxRows={supportsFlexbox() ? 6 : 3}
            minRows={supportsFlexbox() ? 1 : 3}
            // onInput is more responsive, but is an html5 attribute so not supported in older browsers.
            onInput={compatMode ? undefined : this.handleTextChanged}
            onChange={compatMode ? this.handleTextChanged : undefined}
            onKeyDown={this.handleKeyDown}
            placeholder={messagePlaceholder}
          />
          <button
            className="sendBtn"
            onClick={this.addMessage}
            disabled={sendDisabled}
            style={buttonStyle}
          >
            {getMessage(messageTypes.sendButtonLabel)}
          </button>
        </div>
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  agentTyping: state.agentTyping,
  agentEndedConversation: state.agentEndedConversation,
  agentsInitiallyAvailable: state.agentsAvailable,
}))(MessageForm);
