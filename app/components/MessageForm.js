// @flow

import React, {Component} from 'react';
import { QUIQ } from 'utils/utils';
import { addMessage } from 'network/chat';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import messages from 'messages';
import { formatMessage } from 'core-ui/services/i18nService';
import { FormattedMessage } from 'react-intl';
import './styles/MessageForm.scss';

const { COLOR } = QUIQ;
type MessageFormState = {
  text: string,
};

export class MessageForm extends Component {
  state: MessageFormState = {
    text: '',
  };

  handleTextChanged = (e: SyntheticInputEvent) => {
    this.setState({text: e.target.value});
  }

  addMessage = () => {
    const text = this.state.text.trim();
    if (text) {
      addMessage(text);
      this.setState({text: ''});
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === keycodes.enter) {
      e.preventDefault();
      this.addMessage();
    }
  }

  render() {
    return (
      <div className="MessageForm">
        <Textarea
          name="message"
          value={this.state.text}
          onChange={this.handleTextChanged}
          onKeyDown={this.handleKeyDown}
          placeholder={ formatMessage(messages.sendUsAMessage) }
        />
        <button
          className="sendBtn"
          onClick={this.addMessage}
          disabled={this.state.text.trim() === ''}
          style={{ color: COLOR }}
        >
          <FormattedMessage { ...messages.send } />
        </button>
      </div>
    );
  }
}

export default MessageForm;
