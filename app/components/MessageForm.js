// @flow
import React, {Component} from 'react';
import {getStyle} from 'Common/QuiqOptions';
import {intlMessageTypes, MenuItemKeys} from 'Common/Constants';
import {isIE10, isMobile, getIconFromString} from 'Common/Utils';
import {
  setMessageFieldFocused,
  setInputtingEmail,
  setAgentsAvailable,
  setWindowScrollLockEnabled,
} from 'actions/chatActions';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import EmojiTextarea from 'EmojiTextArea';
import EmailInput from 'EmailInput';
import EmojiPicker from 'EmojiPicker';
import Icon from 'core-ui/components/Icon';
import {volumeUp, volumeOff, envelope, smile, paperclip} from 'Icons';
import MenuButton from 'core-ui/components/MenuButton';
import Input from 'components/Input';
import {
  getAgentHasRespondedToLatestConversation,
  getAgentEndedLatestConversation,
  getLastClosedConversationIsSpam,
  getInputtingEmail,
  getClosedConversationCount,
  getMuteSounds,
  getConfiguration,
  getMessage,
} from 'reducers/chat';
import Menu from 'core-ui/components/Menu';
import * as EmojiUtils from '../utils/emojiUtils';
import type {ChatState, Emoji, ChatConfiguration} from 'Common/types';
import {css} from 'react-emotion';

export type MessageFormProps = {
  lastClosedConversationIsSpam: boolean,
  closedConversationCount: number,
  agentHasRespondedToLatestConversation: boolean,
  agentsAvailableOrSubscribed: boolean,
  agentEndedConversation: boolean,
  muteSounds: boolean,
  configuration: ChatConfiguration,
  openFileBrowser: () => void,
  sendTextMessage: (text: string) => void,
  setMessageFieldFocused: (messageFieldFocused: boolean) => void,
  inputtingEmail: boolean,
  setInputtingEmail: (inputtingEmail: boolean) => void,
  setAgentsAvailable: (available: boolean) => void,
  setWindowScrollLockEnabled: (enabled: boolean) => void,
};

type MessageFormState = {
  simpleMode: boolean,
  hasText: boolean,
  inputText: string, // Only used for IE10
  emojiPickerVisible: boolean,
};

const MessageFormStyle = css`
  width: 100%;
  flex: 0 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;

  .messageArea {
    display: flex;
    flex: 1 1 auto;
    min-height: 40px;

    .EmojiTextArea {
      padding: 5px 0;
    }

    .Form {
      flex: 1 1 auto;
    }

    // IE10 uses Input
    .Input {
      flex: 1 1 auto;

      input {
        width: 100%;
        height: 40px;
        padding: 8px;
        border: none;
        outline: none;
        font-size: 16px;
        font-weight: 400;

        &::-ms-clear {
          display: none;
        }
      }
    }

    .messageFormBtn {
      padding: 10px 7px;
      flex: 0 0 auto;
      border: none;
      font-size: 14px;
      background: transparent;
      font-weight: bold;
      transition: 0.15s ease-in-out color;
      cursor: pointer;
      color: #59ad5d;

      &:focus {
        outline: 0;
      }

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }

      &:enabled {
        opacity: 1;
        cursor: pointer;
      }

      &:hover {
        &:enabled {
          /* This is not supported in IE 10/11. Ah well. */
          filter: brightness(85%);
        }
      }
    }
  }

  .poke {
    margin-top: auto;
    background: white;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    animation: fadeUp 1s 1;

    .pokeBody {
      padding: 7px 9px;

      .TypingIndicator {
        margin-left: 5px;
        vertical-align: text-bottom;
      }
    }

    .agentEndedConvo {
      display: flex;
      justify-content: space-between;

      .emailTranscriptInlineButton {
        color: white;
        padding: 0 8px;
      }
    }
  }
`;

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: EmojiTextarea;
  props: MessageFormProps;
  state: MessageFormState = {
    simpleMode: isIE10() || isMobile(),
    hasText: false,
    emojiPickerVisible: false,
    inputText: '',
  };
  checkAvailabilityTimer: TimeoutID;

  checkAvailability = async () => {
    if (this.props.configuration.enforceAgentAvailability) {
      const {available} = await QuiqChatClient.checkForAgents();

      this.props.setAgentsAvailable(available);
      clearTimeout(this.checkAvailabilityTimer);

      // Continue checking only if the user is currently not subscribed
      if (!QuiqChatClient.isUserSubscribed()) {
        this.checkAvailabilityTimer = setTimeout(
          this.checkAvailability,
          this.props.configuration.agentsAvailableTimer,
        );
      }
    }
  };

  focus = () => {
    try {
      if (this.textArea && this.textArea.focus) {
        this.textArea.focus();
      }
    } catch (e) {} // eslint-disable-line no-empty
  };

  componentWillUnmount() {
    clearTimeout(this.checkAvailabilityTimer);
    clearTimeout(updateTimer);
  }

  componentDidMount() {
    if (!this.state.simpleMode) {
      setTimeout(() => {
        this.focus();
      }, 200);
    }

    if (!this.props.agentsAvailableOrSubscribed || this.props.agentEndedConversation) {
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
    const text = this.state.simpleMode ? this.state.inputText : this.textArea.getPlaintext().trim();

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

    if (this.state.simpleMode) {
      this.setState({inputText: '', hasText: false}, this.resetTypingTimers);
    } else {
      // Even if there was no text to send after filtering, we still clear the form and reset timers.
      // No need to explicitly call resetTimers() as setting text field to empty string will result in the same
      this.textArea.setText('');
    }

    if (isMobile() && this.state.simpleMode) {
      this.textArea.input.blur();
    }

    // Finally, send the message
    if (text) {
      this.props.sendTextMessage(text);
    }
  };

  toggleEmojiPicker = () => {
    this.setState(
      state => ({emojiPickerVisible: !state.emojiPickerVisible}),
      () => {
        if (!this.state.emojiPickerVisible) {
          this.focus();
        }
      },
    );
  };

  handleEmojiSelection = (emoji: Emoji) => {
    this.setState({emojiPickerVisible: false});
    this.addEmoji(emoji);
  };

  addEmoji = (emoji: Emoji) => {
    if (this.state.simpleMode) {
      this.setState(state => ({inputText: `${state.inputText} ${emoji.native} `}), this.focus);
    } else {
      this.textArea.insertEmoji(emoji.native);
    }
  };

  toggleEmailInput = () => {
    this.props.setInputtingEmail(!this.props.inputtingEmail);
  };

  handleMessageFieldFocused = () => {
    this.props.setMessageFieldFocused(true);

    this.props.setWindowScrollLockEnabled(false);

    if (this.state.simpleMode) {
      window.scrollTo(0, 0);
    }
  };

  handleMessageFieldLostFocus = () => {
    this.props.setMessageFieldFocused(false);

    this.props.setWindowScrollLockEnabled(true);
  };

  handleIMEModeEntered = (pendingText: string) => {
    this.setState({
      inputText: `${this.textArea.getPlaintext()}${pendingText}`,
      simpleMode: true,
    });
  };

  toggleMuteSounds = () => {
    QuiqChatClient.setCustomPersistentData('muteSounds', !this.props.muteSounds);
  };

  renderMenu = () => {
    const {colors, styles, fontFamily} = this.props.configuration;

    // Ensure custom options come first.
    const options = this.props.configuration.menuOptions.customItems.map(o => ({
      onClick: () => window.open(o.url, '_blank'),
      label: o.label,
      title: o.title,
      id: o.id,
      icon: o.icon
        ? {
            icon: getIconFromString(o.icon),
            style: getStyle(Object.assign({}, styles.OptionsMenuLineItemIcon, o.iconStyle), {
              color: colors.menuText,
            }),
          }
        : undefined,
      style: getStyle(Object.assign({}, styles.OptionsMenuLineItem, o.itemStyle), {
        color: colors.menuText,
        fontFamily,
        zIndex: 1000,
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
          icon: this.props.muteSounds ? volumeUp : volumeOff,
          style: getStyle(styles.OptionsMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.OptionsMenuLineItem, {
          color: colors.menuText,
          fontFamily,
          zIndex: 1000,
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
          icon: envelope,
          style: getStyle(styles.OptionsMenuLineItemIcon, {
            color: colors.menuText,
          }),
        },
        style: getStyle(styles.OptionsMenuLineItem, {
          color: colors.menuText,
          fontFamily,
          zIndex: 1000,
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
              zIndex: 1000,
            })}
          />
        </MenuButton>
      )
    );
  };

  render() {
    const {colors, styles, fontFamily} = this.props.configuration;
    const allowConversationToStart =
      !this.props.configuration.enableManualConvoStart || !this.props.agentEndedConversation;
    const sendDisabled =
      !this.state.hasText || !this.props.agentsAvailableOrSubscribed || !allowConversationToStart;
    const inputDisabled = !this.props.agentsAvailableOrSubscribed || !allowConversationToStart;
    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const sendButtonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      fontFamily,
    });
    const contentButtonStyle = getStyle(styles.ContentButtons, {
      color: '#848484',
      fontSize: '16px',
    });

    let messagePlaceholder = this.props.agentsAvailableOrSubscribed
      ? getMessage(intlMessageTypes.messageFieldPlaceholder)
      : getMessage(intlMessageTypes.agentsNotAvailableMessage);

    if (!allowConversationToStart) {
      messagePlaceholder = getMessage(intlMessageTypes.cannotStartNewConversationMessage);
    }

    return (
      <div className={`MessageForm ${MessageFormStyle}`} style={getStyle(styles.MessageForm)}>
        {this.props.inputtingEmail && (
          <div className="messageArea">
            <EmailInput onSubmit={this.toggleEmailInput} onCancel={this.toggleEmailInput} />
          </div>
        )}

        {!this.props.inputtingEmail && (
          <div className="messageArea">
            {this.state.simpleMode ? (
              <form
                className="Form"
                onSubmit={e => {
                  e.preventDefault();
                  this.addMessage();
                  return false;
                }}
              >
                <Input
                  ref={element => {
                    this.textArea = element;
                  }}
                  data-test="messageInput"
                  inputStyle={inputStyle}
                  value={this.state.inputText}
                  maxLength={1024}
                  autoFocus={!isMobile()}
                  onBlur={this.handleMessageFieldLostFocus}
                  onFocus={this.handleMessageFieldFocused}
                  onSubmit={this.addMessage}
                  disabled={inputDisabled}
                  onChange={(e: SyntheticInputEvent<*>) => this.handleTextChanged(e.target.value)}
                  placeholder={messagePlaceholder}
                />
              </form>
            ) : (
              <EmojiTextarea
                ref={n => {
                  this.textArea = n && n.wrappedInstance;
                }}
                data-test="messageInput"
                style={inputStyle}
                disabled={inputDisabled}
                name="message"
                maxLength={1024}
                onChange={this.handleTextChanged}
                onReturn={this.addMessage}
                onBlur={this.handleMessageFieldLostFocus}
                onFocus={this.handleMessageFieldFocused}
                onIMEModeEntered={this.handleIMEModeEntered}
                placeholder={messagePlaceholder}
              />
            )}

            {this.props.configuration.enableChatFileAttachments && (
              <button
                className="messageFormBtn attachmentBtn"
                style={contentButtonStyle}
                disabled={inputDisabled}
                onClick={this.props.openFileBrowser}
                title={getMessage(intlMessageTypes.attachmentBtnTooltip)}
              >
                <Icon icon={paperclip} />
              </button>
            )}
            {this.props.configuration.enableEmojis &&
              EmojiUtils.emojisEnabledByCustomer() &&
              !isMobile() && (
                <button
                  className="messageFormBtn emojiBtn"
                  style={contentButtonStyle}
                  disabled={inputDisabled}
                  onClick={this.toggleEmojiPicker}
                  title={getMessage(intlMessageTypes.emojiPickerTooltip)}
                >
                  <Icon icon={smile} />
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
              EmojiUtils.emojisEnabledByCustomer() &&
              !isMobile() && (
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
  setWindowScrollLockEnabled,
};

export default connect(
  (state: ChatState) => ({
    muteSounds: getMuteSounds(state),
    configuration: getConfiguration(state),
    agentEndedConversation: getAgentEndedLatestConversation(state),
    lastClosedConversationIsSpam: getLastClosedConversationIsSpam(state),
    closedConversationCount: getClosedConversationCount(state),
    agentHasRespondedToLatestConversation: getAgentHasRespondedToLatestConversation(state),
    inputtingEmail: getInputtingEmail(state),
  }),
  mapDispatchToProps,
)(MessageForm);
