// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {supportsFlexbox} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {messageTypes} from 'Common/Constants';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import EmojiTextarea from 'EmojiTextArea';
import EmojiPicker from 'EmojiPicker';
import * as EmojiUtils from '../utils/emojiUtils';
import './styles/MessageForm.scss';
import type {ChatState, Emoji} from 'Common/types';

const {colors, fontFamily, styles} = quiqOptions;

export type MessageFormProps = {
  agentTyping: boolean,
  agentEndedConversation: boolean,
  agentsInitiallyAvailable?: boolean,
};

type MessageFormState = {
  hasText: boolean,
  agentsAvailable: boolean,
  emojiPickerVisible: boolean,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: EmojiTextarea;
  props: MessageFormProps;
  state: MessageFormState = {
    hasText: false,
    agentsAvailable: true,
    emojiPickerVisible: false,
  };
  checkAvailabilityTimer: number;

  checkAvailability = async () => {
    if (quiqOptions.enforceAgentAvailability) {
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
    const text = this.textArea.getPlaintext().trim();
    // Filter emojis based on includeEmojis/excludeEmojis
    const filteredText = EmojiUtils.filterEmojisFromText(text);
    if (filteredText) {
      QuiqChatClient.updateMessagePreview(filteredText, true);
    }
    updateTimer = undefined;
  };

  stopTyping = () => {
    const text = this.textArea.getPlaintext().trim();
    // Filter emojis based on includeEmojis/excludeEmojis
    const filteredText = EmojiUtils.filterEmojisFromText(text);
    QuiqChatClient.updateMessagePreview(filteredText, false);
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

  handleTextChanged = (text: string) => {
    if (text) {
      this.startTypingTimers();
    } else {
      this.resetTypingTimers();
    }

    this.setState({hasText: !!text});
  };

  addMessage = () => {
    const text = this.textArea.getPlaintext().trim();

    // Filter emojis based on includeEmojis/excludeEmojis
    const filteredText = EmojiUtils.filterEmojisFromText(text);

    // Don't send message if there's only an empty string left after filtering
    if (filteredText) {
      QuiqChatClient.sendMessage(filteredText);
    }

    // Even if there was no text to send after filtering, we still clear the form and reset timers.
    // No need to explicitly call resetTimers() as setting text field to empty string will result in the same
    this.textArea.setText('');
  };

  handleReturnKey = () => {
    this.addMessage();
  };

  toggleEmojiPicker = () => {
    this.setState(
      state => ({emojiPickerVisible: !state.emojiPickerVisible}),
      () => {
        if (!this.state.emojiPickerVisible) {
          this.textArea.focus();
        }
      },
    );
  };

  handleEmojiSelection = (emoji: Emoji) => {
    this.setState({emojiPickerVisible: false});
    this.addEmoji(emoji);
  };

  addEmoji = (emoji: Emoji) => {
    this.textArea.insertEmoji(emoji.native);
  };

  render() {
    const sendDisabled = !this.state.hasText || !this.state.agentsAvailable;
    const emopjiPickerDisabled = !this.state.agentsAvailable;
    const messagePlaceholder = this.state.agentsAvailable
      ? getMessage(messageTypes.messageFieldPlaceholder)
      : getMessage(messageTypes.agentsNotAvailableMessage);

    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const buttonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
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
          <EmojiTextarea
            ref={n => {
              this.textArea = n;
            }}
            style={inputStyle}
            disabled={!this.state.agentsAvailable}
            name="message"
            maxLength={1024}
            onChange={this.handleTextChanged}
            onReturn={this.handleReturnKey}
            placeholder={messagePlaceholder}
          />
          {EmojiUtils.emojisEnabledByCustomer() && (
            <button
              className="messageFormBtn emojiBtn"
              disabled={emopjiPickerDisabled}
              onClick={this.toggleEmojiPicker}
            >
              <i className="fa fa-smile-o" title={getMessage(messageTypes.emojiPickerTooltip)} />
            </button>
          )}
          <button
            className="messageFormBtn sendBtn"
            onClick={this.addMessage}
            disabled={sendDisabled}
            style={buttonStyle}
          >
            {getMessage(messageTypes.sendButtonLabel)}
          </button>
          {EmojiUtils.emojisEnabledByCustomer() && (
            <EmojiPicker
              visible={this.state.emojiPickerVisible}
              addEmoji={this.handleEmojiSelection}
              emojiFilter={EmojiUtils.emojiFilter}
              onOutsideClick={this.toggleEmojiPicker}
              ignoreOutsideClickOnSelectors={['.emojiBtn']}
            />
          )}
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
