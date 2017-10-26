// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {supportsFlexbox} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {messageTypes, MenuItemKeys} from 'Common/Constants';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import EmojiTextarea from 'EmojiTextArea';
import EmailInput from 'EmailInput';
import EmojiPicker from 'EmojiPicker';
import MenuButton from 'MenuButton';
import {getTranscript} from 'reducers/chat';
import Menu from 'Menu';
import {map} from 'lodash';
import * as EmojiUtils from '../utils/emojiUtils';
import './styles/MessageForm.scss';
import type {ChatState, Emoji, Message} from 'Common/types';

const {
  colors,
  fontFamily,
  styles,
  menuOptions,
  enforceAgentAvailability,
  agentsAvailableTimer,
} = quiqOptions;

export type MessageFormProps = {
  agentTyping: boolean,
  agentEndedConversation: boolean,
  agentsInitiallyAvailable?: boolean,
  transcript: Array<Message>,
  openFileBrowser: () => void,
};

type MessageFormState = {
  hasText: boolean,
  agentsAvailable: boolean,
  emojiPickerVisible: boolean,
  inputtingEmail: boolean,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: EmojiTextarea;
  props: MessageFormProps;
  state: MessageFormState = {
    hasText: false,
    agentsAvailable: true,
    emojiPickerVisible: false,
    inputtingEmail: false,
  };
  checkAvailabilityTimer: number;

  checkAvailability = async () => {
    if (enforceAgentAvailability) {
      const available = await QuiqChatClient.checkForAgents();

      this.setState({agentsAvailable: available.available});
      clearTimeout(this.checkAvailabilityTimer);
      this.checkAvailabilityTimer = setTimeout(this.checkAvailability, agentsAvailableTimer);
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
      QuiqChatClient.updateTypingIndicator(filteredText, true);
    }
    updateTimer = undefined;
  };

  stopTyping = () => {
    const text = this.textArea.getPlaintext().trim();
    // Filter emojis based on includeEmojis/excludeEmojis
    const filteredText = EmojiUtils.filterEmojisFromText(text);
    QuiqChatClient.updateTypingIndicator(filteredText, false);
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
      QuiqChatClient.sendTextMessage(filteredText);
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

  toggleEmailInput = () => {
    this.setState((prevState: MessageFormState) => ({
      inputtingEmail: !prevState.inputtingEmail,
    }));
  };

  renderMenu = () => {
    const keys = map(menuOptions, (v, k) => (v ? k : undefined)).filter(k =>
      Object.values(MenuItemKeys).includes(k),
    );
    if (!keys.length) return null;
    const options = [
      {
        onClick: this.toggleEmailInput,
        label: getMessage(messageTypes.emailTranscriptMenuMessage),
        title: getMessage(messageTypes.emailTranscriptMenuTooltip),
        id: MenuItemKeys.EMAIL_TRANSCRIPT,
        icon: {
          name: 'envelope-o',
          style: getStyle(styles.EmailTranscriptMenuLineItemIcon, {
            color: colors.agentMessageLinkText,
          }),
        },
        style: getStyle(styles.EmailTranscriptMenuLineItem, {
          color: colors.agentMessageLinkText,
          fontFamily,
        }),
        disabled: this.props.transcript.filter(m => m.authorType === 'User').length === 0,
      },
    ];

    return (
      <MenuButton
        buttonStyles={getStyle(
          {
            borderRight: '2px solid rgb(244, 244, 248)',
          },
          styles.OptionsMenuButton,
        )}
        iconStyles={getStyle(styles.OptionsMenuButtonIcon, {
          color: colors.primary,
        })}
        title={getMessage(messageTypes.optionsMenuTooltip)}
        disabled={!this.state.agentsAvailable}
      >
        <Menu
          items={options.filter(o => keys.includes(o.id))}
          containerStyle={getStyle(styles.EmailTranscriptMenuContainer, {
            fontFamily,
          })}
        />
      </MenuButton>
    );
  };

  render() {
    const sendDisabled = !this.state.hasText || !this.state.agentsAvailable;
    const emopjiPickerDisabled = !this.state.agentsAvailable;
    const contentButtonsDisabled = !this.state.agentsAvailable;
    const messagePlaceholder = this.state.agentsAvailable
      ? getMessage(messageTypes.messageFieldPlaceholder)
      : getMessage(messageTypes.agentsNotAvailableMessage);
    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const sendButtonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      fontFamily,
    });
    const emailTranscriptButtonStyle = getStyle(styles.InlineEmailTranscriptButton, {
      backgroundColor: colors.primary,
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
                <div className="agentEndedConvo">
                  <span style={{fontFamily}}>
                    {getMessage(messageTypes.agentEndedConversationMessage)}
                  </span>
                  <button style={emailTranscriptButtonStyle} onClick={this.toggleEmailInput}>
                    {getMessage(messageTypes.emailTranscriptInlineButton)}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {this.state.inputtingEmail && (
          <div className="messageArea">
            <EmailInput onSubmit={this.toggleEmailInput} onCancel={this.toggleEmailInput} />
          </div>
        )}

        {!this.state.inputtingEmail && (
          <div className="messageArea">
            {this.renderMenu()}
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
            <button
              className="messageFormBtn attachmentBtn"
              disabled={contentButtonsDisabled}
              onClick={this.props.openFileBrowser}
            >
              <i
                className="fa fa-paperclip"
                title={getMessage(messageTypes.attachmentBtnTooltip)}
              />
            </button>
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
              style={sendButtonStyle}
            >
              <i className="fa fa-paper-plane" title={getMessage(messageTypes.sendButtonTooltip)} />
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
        )}
      </div>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    transcript: getTranscript(state),
    agentTyping: state.agentTyping,
    agentEndedConversation: state.agentEndedConversation,
    agentsInitiallyAvailable: state.agentsAvailable,
  }),
  dispatch => ({dispatch}),
)(MessageForm);
