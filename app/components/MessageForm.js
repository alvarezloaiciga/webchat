// @flow

import React, {Component} from 'react';
import QUIQ from 'utils/quiq';
import {addMessage, updateMessagePreview} from 'network/chat';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import messages from 'messages';
import {formatMessage} from 'core-ui/services/i18nService';
import {FormattedMessage} from 'react-intl';
import './styles/MessageForm.scss';

const {COLOR} = QUIQ;
type MessageFormState = {
  text: string,
};

let updateTimer;
export class MessageForm extends Component {
  state: MessageFormState = {
    text: '',
  };

  startTyping = () => {
    updateMessagePreview(this.state.text, true);
    updateTimer = undefined;
  };
  stopTyping = () => {
    updateMessagePreview(this.state.text, false);
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
  handleTextChanged = (e: SyntheticInputEvent) => {
    const state = Object.assign({
      text: e.target.value,
    });

    this.setState(state, e.target.value ? this.startTypingTimers : this.resetTypingTimers);
  };
  addMessage = () => {
    const text = this.state.text.trim();
    if (text) {
      this.setState({text: ''}, this.resetTypingTimers);
      addMessage(text);
    }
  };
  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === keycodes.enter) {
      e.preventDefault();
      this.addMessage();
    }
  };
  render() {
    return (
      <div className="MessageForm">
        <Textarea
          name="message"
          value={this.state.text}
          onChange={this.handleTextChanged}
          onKeyDown={this.handleKeyDown}
          placeholder={formatMessage(messages.sendUsAMessage)}
        />
        <button
          className="sendBtn"
          onClick={this.addMessage}
          disabled={this.state.text.trim() === ''}
          style={{color: COLOR}}
        >
          <FormattedMessage {...messages.send} />
        </button>
      </div>
    );
  }
}

export default MessageForm;
