// @flow
import React, {Component} from 'react';
import {enableEmailForCurrentConversation} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {messageTypes, MenuItemKeys} from 'Common/Constants';
import {setMuteSounds, setMessageFieldFocused, setInputtingEmail} from 'actions/chatActions';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import EmojiTextarea from 'EmojiTextArea';
import EmailInput from 'EmailInput';
import EmojiPicker from 'EmojiPicker';
import MenuButton from 'core-ui/components/MenuButton';
import {
  getTranscript,
  getAgentEndedConversation,
  getInputtingEmail,
  getPlatformEvents,
} from 'reducers/chat';
import Menu from 'core-ui/components/Menu';
import * as EmojiUtils from '../utils/emojiUtils';
import './styles/MessageForm.scss';
import type {ChatState, Emoji, Message, ChatConfiguration, Event} from 'Common/types';

const {colors, fontFamily, styles, enforceAgentAvailability, agentsAvailableTimer} = quiqOptions;

export type MessageFormProps = {
  agentsInitiallyAvailable?: boolean,
  agentEndedConversation: boolean,
  muteSounds: boolean,
  configuration: ChatConfiguration,
  transcript: Array<Message>,
  platformEvents: Array<Event>,
  openFileBrowser: () => void,
  setMuteSounds: (muteSounds: boolean) => void,
  setMessageFieldFocused: (messageFieldFocused: boolean) => void,
  inputtingEmail: boolean,
  setInputtingEmail: (inputtingEmail: boolean) => void,
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

    this.props.setMuteSounds(
      localStorage.getItem(`quiq_mute_sounds_${quiqOptions.contactPoint}`) === 'true',
    );
    this.props.setMessageFieldFocused(false);
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
    this.props.setInputtingEmail(!this.props.inputtingEmail);
  };

  handleMessageFieldFocused = () => {
    this.props.setMessageFieldFocused(true);
  };

  handleMessageFieldLostFocus = () => {
    this.props.setMessageFieldFocused(false);
  };

  toggleMuteSounds = () => {
    localStorage.setItem(
      `quiq_mute_sounds_${quiqOptions.contactPoint}`,
      !this.props.muteSounds ? 'true' : 'false',
    );

    this.props.setMuteSounds(!this.props.muteSounds);
  };

  renderMenu = () => {
    const options = [];

    if (this.props.configuration.playSoundOnNewMessage) {
      options.push({
        onClick: this.toggleMuteSounds,
        label: this.props.muteSounds
          ? getMessage(messageTypes.unmuteSounds)
          : getMessage(messageTypes.muteSounds),
        title: this.props.muteSounds
          ? getMessage(messageTypes.unmuteSoundsTooltip)
          : getMessage(messageTypes.muteSoundsTooltip),
        id: MenuItemKeys.MUTE_SOUNDS,
        icon: {
          name: this.props.muteSounds ? 'volume-up' : 'volume-off',
          style: getStyle(styles.EmailTranscriptMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.EmailTranscriptMenuLineItem, {
          color: colors.menuText,
          fontFamily,
        }),
        disabled: false,
      });
    }

    if (this.props.configuration.enableChatEmailTranscript) {
      options.push({
        onClick: this.toggleEmailInput,
        label: getMessage(messageTypes.emailTranscriptMenuMessage),
        title: getMessage(messageTypes.emailTranscriptMenuTooltip),
        id: MenuItemKeys.EMAIL_TRANSCRIPT,
        icon: {
          name: 'envelope-o',
          style: getStyle(styles.EmailTranscriptMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.EmailTranscriptMenuLineItem, {
          color: colors.menuText,
          fontFamily,
        }),
        disabled: !enableEmailForCurrentConversation(
          this.props.transcript,
          this.props.platformEvents,
        ),
      });
    }

    return (
      options.length > 0 && (
        <MenuButton
          buttonStyles={getStyle(
            {
              borderRight: '2px solid rgb(244, 244, 248)',
            },
            styles.OptionsMenuButton,
          )}
          iconStyles={getStyle(styles.OptionsMenuButtonIcon, {
            color: '#848484',
            fontSize: '19px',
            marginTop: '1px',
          })}
          title={getMessage(messageTypes.optionsMenuTooltip)}
          menuPosition="top-right"
          offset={{
            horizontal: '-115px',
            vertical: '40px',
          }}
        >
          <Menu
            items={options}
            containerStyle={getStyle(styles.EmailTranscriptMenuContainer, {
              fontFamily,
            })}
          />
        </MenuButton>
      )
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
    const contentButtonStyle = getStyle(styles.ContentButtons, {
      color: '#848484',
      fontSize: '16px',
    });

    return (
      <div className="MessageForm" style={getStyle(styles.MessageForm)}>
        {this.props.inputtingEmail && (
          <div className="messageArea">
            <EmailInput onSubmit={this.toggleEmailInput} onCancel={this.toggleEmailInput} />
          </div>
        )}

        {!this.state.inputtingEmail && (
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
              onBlur={this.handleMessageFieldLostFocus}
              onFocus={this.handleMessageFieldFocused}
              placeholder={messagePlaceholder}
            />
            {this.props.configuration.enableChatFileAttachments && (
              <button
                className="messageFormBtn attachmentBtn"
                style={contentButtonStyle}
                disabled={contentButtonsDisabled}
                onClick={this.props.openFileBrowser}
                title={getMessage(messageTypes.attachmentBtnTooltip)}
              >
                <i className="fa fa-paperclip" />
              </button>
            )}
            {this.props.configuration.enableEmojis &&
              EmojiUtils.emojisEnabledByCustomer() && (
                <button
                  className="messageFormBtn emojiBtn"
                  style={contentButtonStyle}
                  disabled={emopjiPickerDisabled}
                  onClick={this.toggleEmojiPicker}
                  title={getMessage(messageTypes.emojiPickerTooltip)}
                >
                  <i className="fa fa-smile-o" />
                </button>
              )}
            {sendDisabled ? (
              this.renderMenu()
            ) : (
              <button
                className="messageFormBtn sendBtn"
                onClick={this.addMessage}
                disabled={sendDisabled}
                style={sendButtonStyle}
              >
                {getMessage(messageTypes.sendButtonLabel)}
              </button>
            )}
            {this.props.configuration.enableEmojis &&
              EmojiUtils.emojisEnabledByCustomer() && (
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

const mapDispatchToProps = {
  setMuteSounds,
  setMessageFieldFocused,
  setInputtingEmail,
};

export default connect(
  (state: ChatState) => ({
    transcript: getTranscript(state),
    platformEvents: getPlatformEvents(state),
    agentsInitiallyAvailable: state.agentsAvailable,
    muteSounds: state.muteSounds,
    configuration: state.configuration,
    agentEndedConversation: getAgentEndedConversation(state),
    inputtingEmail: getInputtingEmail(state),
  }),
  mapDispatchToProps,
)(MessageForm);

/*
   {(!supportsFlexbox() || this.props.agentEndedConversation) && (
   <div className="poke">
   {this.props.agentEndedConversation && (
   <div className="pokeBody">
   <div className="agentEndedConvo">
   <span style={{fontFamily}}>
   {getMessage(messageTypes.agentEndedConversationMessage)}
   </span>
   {this.props.configuration.enableChatEmailTranscript && (
   <Button
   disabled={
   this.props.transcript.filter(m => m.authorType === 'User').length === 0 ||
   this.props.chatIsSpam
   }
   className="emailTranscriptInlineButton"
   title={getMessage(messageTypes.emailTranscriptInlineButton)}
   text={getMessage(messageTypes.emailTranscriptInlineButton)}
   style={emailTranscriptButtonStyle}
   onClick={this.toggleEmailInput}
   />
   )}
   </div>
   </div>
   )}
   </div>
   )}
   */
