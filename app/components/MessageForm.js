// @flow

import React, {Component} from 'react';
import {compatibilityMode} from 'utils/utils';
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
  textArea: any;
  state: MessageFormState = {
    text: '',
  };
  componentDidMount() {
    setTimeout(() => this.textArea.focus(), 200);
  }
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
    const sendDisabled = this.state.text.trim() === '';
    const compatMode = compatibilityMode();

    return (
      <div className="MessageForm">
        <Textarea
          ref={n => {
            this.textArea = n;
          }}
          name="message"
          value={this.state.text}
          // onInput is more responsive, but is an html5 attribute so not supported in older browsers.
          onInput={compatMode ? undefined : this.handleTextChanged}
          onChange={compatMode ? this.handleTextChanged : undefined}
          onKeyDown={this.handleKeyDown}
          placeholder={formatMessage(messages.sendUsAMessage)}
        />
        <button
          className="sendBtn"
          onClick={this.addMessage}
          disabled={sendDisabled}
          style={{color: COLOR, opacity: sendDisabled ? '.5' : '1'}}
        >
          <FormattedMessage {...messages.send} />
        </button>
      </div>
    );
  }
}

export default MessageForm;
