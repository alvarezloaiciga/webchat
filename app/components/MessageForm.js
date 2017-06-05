// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {compatibilityMode, supportsFlexbox} from 'utils/utils';
import QUIQ from 'utils/quiq';
import {addMessage, updateMessagePreview} from 'quiq-chat';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import messages from 'messages';
import {formatMessage} from 'utils/i18n';
import {FormattedMessage} from 'react-intl';
import './styles/MessageForm.scss';

const {COLOR} = QUIQ;

export type MessageFormProps = {
  agentTyping: boolean,
};

type MessageFormState = {
  text: string,
  agentTyping?: number,
};

let updateTimer;
export class MessageForm extends Component {
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

      if (this.props.agentTyping) {
        this.agentStartTyping();
      }
    }, 200);
  }
  componentWillReceiveProps(nextProps: MessageFormProps) {
    if (nextProps.agentTyping && !this.props.agentTyping) {
      this.agentStartTyping();
    }
    if (nextProps.agentTyping === false && this.props.agentTyping) {
      this.agentStopTyping();
    }
  }
  agentStartTyping = () => {
    clearInterval(this.state.agentTyping);
    this.setState({agentTyping: setTimeout(this.agentStopTyping, 10000)});
  };

  agentStopTyping = () => {
    clearInterval(this.state.agentTyping);
    this.setState({agentTyping: undefined});
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
    const sendDisabled = this.state.text.trim() === '';
    const compatMode = compatibilityMode();

    return (
      <div className="MessageForm">
        {(!supportsFlexbox() || this.state.agentTyping) &&
          <div className="poke">
            {this.state.agentTyping &&
              <div className="pokeBody">
                <FormattedMessage {...messages.agentIsTyping} />
                <TypingIndicator yScale={0.5} xScale={0.75} />
              </div>}
          </div>}

        <div className="messageArea">
          <Textarea
            ref={n => {
              this.textArea = n;
            }}
            name="message"
            value={this.state.text}
            maxRows={supportsFlexbox() ? 6 : 3}
            minRows={supportsFlexbox() ? 1 : 3}
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
      </div>
    );
  }
}

export default MessageForm;
