// @flow
import React, {Component} from 'react';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {intlMessageTypes, MenuItemKeys} from 'Common/Constants';
import {isIE10, isMobile} from 'Common/Utils';
import {setMessageFieldFocused, setInputtingEmail, setAgentsAvailable} from 'actions/chatActions';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import EmojiTextarea from 'EmojiTextArea';
import EmailInput from 'EmailInput';
import EmojiPicker from 'EmojiPicker';
import MenuButton from 'core-ui/components/MenuButton';
import Input from 'core-ui/components/Input';
import {
  getAgentHasRespondedToLatestConversation,
  getAgentEndedLatestConversation,
  getLastClosedConversationIsSpam,
  getInputtingEmail,
  getClosedConversationCount,
  getMuteSounds,
} from 'reducers/chat';
import Menu from 'core-ui/components/Menu';
import * as EmojiUtils from '../utils/emojiUtils';
import './styles/MessageForm.scss';
import type {ChatState, Emoji, ChatConfiguration} from 'Common/types';

const {colors, fontFamily, styles, enforceAgentAvailability, agentsAvailableTimer} = quiqOptions;

export type MessageFormProps = {
  lastClosedConversationIsSpam: boolean,
  closedConversationCount: number,
  agentHasRespondedToLatestConversation: boolean,
  agentsAvailable?: boolean,
  agentEndedConversation: boolean,
  muteSounds: boolean,
  configuration: ChatConfiguration,
  openFileBrowser: () => void,
  setMessageFieldFocused: (messageFieldFocused: boolean) => void,
  inputtingEmail: boolean,
  setInputtingEmail: (inputtingEmail: boolean) => void,
  setAgentsAvailable: (agentsAvailable: boolean) => void,
};

type MessageFormState = {
  hasText: boolean,
  inputText: string, // Only used for IE10
  emojiPickerVisible: boolean,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: EmojiTextarea;
  props: MessageFormProps;
  state: MessageFormState = {
    hasText: false,
    emojiPickerVisible: false,
    inputText: '',
  };
  checkAvailabilityTimer: number;
  simpleMode: boolean = isIE10() || isMobile();

  checkAvailability = async () => {
    if (enforceAgentAvailability) {
      const available = await QuiqChatClient.checkForAgents();

      this.props.setAgentsAvailable(available.available);
      clearTimeout(this.checkAvailabilityTimer);
      this.checkAvailabilityTimer = setTimeout(this.checkAvailability, agentsAvailableTimer);
    }
  };

  componentWillUnmount() {
    clearTimeout(this.checkAvailabilityTimer);
  }

  componentDidMount() {
    if (!this.simpleMode) {
      setTimeout(() => {
        if (this.textArea) {
          this.textArea.focus();
        }
      }, 200);
    }

    if (
      (!this.props.agentsAvailable && !QuiqChatClient.isUserSubscribed()) ||
      this.props.agentEndedConversation
    ) {
      this.checkAvailability();
    }

    this.props.setMessageFieldFocused(false);
  }

  componentWillUpdate(nextProps: MessageFormProps) {
    if (!this.props.agentEndedConversation && nextProps.agentEndedConversation) {
      this.checkAvailability();
    }
  }

  getFilteredText = () => {
    const text = this.simpleMode ? this.state.inputText : this.textArea.getPlaintext().trim();

    // Filter emojis based on includeEmojis/excludeEmojis
    return EmojiUtils.filterEmojisFromText(text);
  };

  startTyping = () => {
    const text = this.getFilteredText();
    if (text) {
      QuiqChatClient.updateTypingIndicator(text, true);
    }
    updateTimer = undefined;
  };

  stopTyping = () => {
    QuiqChatClient.updateTypingIndicator(this.getFilteredText(), false);
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
    const typingTimers = text ? this.startTypingTimers : this.resetTypingTimers;
    this.setState({hasText: !!text, inputText: text}, typingTimers);
  };

  addMessage = () => {
    const text = this.getFilteredText();
    if (text) {
      QuiqChatClient.sendTextMessage(text);
    }

    if (this.simpleMode) {
      this.setState({inputText: '', hasText: false}, this.resetTypingTimers);
    } else {
      // Even if there was no text to send after filtering, we still clear the form and reset timers.
      // No need to explicitly call resetTimers() as setting text field to empty string will result in the same
      this.textArea.setText('');
    }
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
    QuiqChatClient.setCustomPersistentData('muteSounds', !this.props.muteSounds);
  };

  renderMenu = () => {
    // Ensure custom options come first.
    const options = this.props.configuration.menuOptions.customItems.map(o => ({
      onClick: () => window.open(o.url, '_blank'),
      label: o.label,
      title: o.title,
      id: o.id,
      icon: o.icon
        ? {
            name: o.icon,
            style: getStyle(Object.assign({}, styles.OptionsMenuLineItemIcon, o.iconStyle), {
              color: colors.menuText,
            }),
          }
        : undefined,
      style: getStyle(Object.assign({}, styles.OptionsMenuLineItem, o.itemStyle), {
        color: colors.menuText,
        fontFamily,
      }),
    }));

    if (this.props.configuration.playSoundOnNewMessage) {
      options.push({
        onClick: this.toggleMuteSounds,
        label: this.props.muteSounds
          ? getMessage(intlMessageTypes.unmuteSounds)
          : getMessage(intlMessageTypes.muteSounds),
        title: this.props.muteSounds
          ? getMessage(intlMessageTypes.unmuteSoundsTooltip)
          : getMessage(intlMessageTypes.muteSoundsTooltip),
        id: MenuItemKeys.MUTE_SOUNDS,
        icon: {
          name: this.props.muteSounds ? 'volume-up' : 'volume-off',
          style: getStyle(styles.OptionsMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.OptionsMenuLineItem, {
          color: colors.menuText,
          fontFamily,
        }),
        disabled: false,
      });
    }

    if (this.props.configuration.enableChatEmailTranscript) {
      options.push({
        onClick: this.toggleEmailInput,
        label: getMessage(intlMessageTypes.emailTranscriptMenuMessage),
        title: getMessage(intlMessageTypes.emailTranscriptMenuTooltip),
        id: MenuItemKeys.EMAIL_TRANSCRIPT,
        icon: {
          name: 'envelope',
          style: getStyle(styles.OptionsMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.OptionsMenuLineItem, {
          color: colors.menuText,
          fontFamily,
        }),
        disabled:
          (this.props.closedConversationCount === 0 || this.props.lastClosedConversationIsSpam) &&
          !this.props.agentHasRespondedToLatestConversation,
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
          title={getMessage(intlMessageTypes.optionsMenuTooltip)}
          menuPosition="top-right"
          offset={Object.assign(
            {
              horizontal: '-115px',
              vertical: '40px',
            },
            this.props.configuration.menuOptions.offset,
          )}
        >
          <Menu
            items={options}
            containerStyle={getStyle(styles.OptionsMenuContainer, {
              fontFamily,
            })}
          />
        </MenuButton>
      )
    );
  };

  render() {
    const allowConversationToStart =
      !this.props.configuration.enableManualConvoStart || !this.props.agentEndedConversation;
    const sendDisabled =
      !this.state.hasText || !this.props.agentsAvailable || !allowConversationToStart;
    const emopjiPickerDisabled = !this.props.agentsAvailable || !allowConversationToStart;
    const contentButtonsDisabled = !this.props.agentsAvailable || !allowConversationToStart;
    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const sendButtonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      fontFamily,
    });
    const contentButtonStyle = getStyle(styles.ContentButtons, {
      color: '#848484',
      fontSize: '16px',
    });

    let messagePlaceholder = this.props.agentsAvailable
      ? getMessage(intlMessageTypes.messageFieldPlaceholder)
      : getMessage(intlMessageTypes.agentsNotAvailableMessage);

    if (!allowConversationToStart) {
      messagePlaceholder = getMessage(intlMessageTypes.cannotStartNewConversationMessage);
    }

    return (
      <div className="MessageForm" style={getStyle(styles.MessageForm)}>
        {this.props.inputtingEmail && (
          <div className="messageArea">
            <EmailInput onSubmit={this.toggleEmailInput} onCancel={this.toggleEmailInput} />
          </div>
        )}

        {!this.props.inputtingEmail && (
          <div className="messageArea">
            {this.simpleMode ? (
              <Input
                ref={element => {
                  this.textArea = element;
                }}
                inputStyle={inputStyle}
                value={this.state.inputText}
                maxLength={1024}
                autoFocus
                onBlur={this.handleMessageFieldLostFocus}
                onFocus={this.handleMessageFieldFocused}
                disabled={!this.props.agentsAvailable || !allowConversationToStart}
                onChange={(e: SyntheticInputEvent<*>) => this.handleTextChanged(e.target.value)}
                onSubmit={this.addMessage}
                placeholder={messagePlaceholder}
              />
            ) : (
              <EmojiTextarea
                ref={n => {
                  this.textArea = n;
                }}
                style={inputStyle}
                disabled={!this.props.agentsAvailable || !allowConversationToStart}
                name="message"
                maxLength={1024}
                onChange={this.handleTextChanged}
                onReturn={this.addMessage}
                onBlur={this.handleMessageFieldLostFocus}
                onFocus={this.handleMessageFieldFocused}
                placeholder={messagePlaceholder}
              />
            )}

            {this.props.configuration.enableChatFileAttachments && (
              <button
                className="messageFormBtn attachmentBtn"
                style={contentButtonStyle}
                disabled={contentButtonsDisabled}
                onClick={this.props.openFileBrowser}
                title={getMessage(intlMessageTypes.attachmentBtnTooltip)}
              >
                <i className="fa fa-paperclip" />
              </button>
            )}
            {!this.simpleMode &&
              this.props.configuration.enableEmojis &&
              EmojiUtils.emojisEnabledByCustomer() && (
                <button
                  className="messageFormBtn emojiBtn"
                  style={contentButtonStyle}
                  disabled={emopjiPickerDisabled}
                  onClick={this.toggleEmojiPicker}
                  title={getMessage(intlMessageTypes.emojiPickerTooltip)}
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
                {getMessage(intlMessageTypes.sendButtonLabel)}
              </button>
            )}
            {this.props.configuration.enableEmojis &&
              !this.simpleMode &&
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
  setMessageFieldFocused,
  setInputtingEmail,
  setAgentsAvailable,
};

export default connect(
  (state: ChatState) => ({
    agentsAvailable: state.agentsAvailable || QuiqChatClient.isUserSubscribed(),
    muteSounds: getMuteSounds(state),
    configuration: state.configuration,
    agentEndedConversation: getAgentEndedLatestConversation(state),
    lastClosedConversationIsSpam: getLastClosedConversationIsSpam(state),
    closedConversationCount: getClosedConversationCount(state),
    agentHasRespondedToLatestConversation: getAgentHasRespondedToLatestConversation(state),
    inputtingEmail: getInputtingEmail(state),
  }),
  mapDispatchToProps,
)(MessageForm);
