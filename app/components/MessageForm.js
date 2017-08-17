// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {compatibilityMode, supportsFlexbox} from 'utils/utils';
import quiqOptions, {getStyle, getMessage} from 'utils/quiq';
import {messageTypes} from 'appConstants';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import './styles/MessageForm.scss';
import type {ChatState} from 'types';

const {colors, fontFamily, styles} = quiqOptions;

export type MessageFormProps = {
  agentTyping: boolean,
};

type MessageFormState = {
  text: string,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: any;
  props: MessageFormProps;
  state: MessageFormState = {
    text: '',
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.textArea) {
        this.textArea.focus();
      }
    }, 200);
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
    });

    this.setState(state, e.target.value ? this.startTypingTimers : this.resetTypingTimers);
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
    const sendDisabled = this.state.text.trim() === '';
    const compatMode = compatibilityMode();

    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily: fontFamily});
    const buttonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      opacity: sendDisabled ? '.5' : '1',
      fontFamily: fontFamily,
    });

    return (
      <div className="MessageForm" style={getStyle(styles.MessageForm)}>
        {(!supportsFlexbox() || this.props.agentTyping) &&
          <div className="poke">
            {this.props.agentTyping &&
              <div className="pokeBody">
                <span style={{fontFamily: fontFamily}}>
                  {getMessage(messageTypes.agentTypingMessage)}
                </span>
                <TypingIndicator yScale={0.5} xScale={0.75} />
              </div>}
          </div>}

        <div className="messageArea">
          <Textarea
            inputRef={n => {
              this.textArea = n;
            }}
            style={inputStyle}
            name="message"
            value={this.state.text}
            maxLength={1024}
            maxRows={supportsFlexbox() ? 6 : 3}
            minRows={supportsFlexbox() ? 1 : 3}
            // onInput is more responsive, but is an html5 attribute so not supported in older browsers.
            onInput={compatMode ? undefined : this.handleTextChanged}
            onChange={compatMode ? this.handleTextChanged : undefined}
            onKeyDown={this.handleKeyDown}
            placeholder={getMessage(messageTypes.messageFieldPlaceholder)}
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
}))(MessageForm);
