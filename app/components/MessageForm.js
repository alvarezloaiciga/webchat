// @flow
import React, {Component} from 'react';
import {getStyle} from 'Common/QuiqOptions';
import {intlMessageTypes, MenuItemKeys} from 'Common/Constants';
import {isIE10, isMobile} from 'Common/Utils';
import {getOrientation} from 'utils/mobileUtils';
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
import MenuButton from 'core-ui/components/MenuButton';
import Input from 'core-ui/components/Input';
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
import './styles/MessageForm.scss';
import type {ChatState, Emoji, ChatConfiguration} from 'Common/types';

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
  setAgentsAvailable: (available: boolean) => void,
  setWindowScrollLockEnabled: (enabled: boolean) => void,
};

type MessageFormState = {
  simpleMode: boolean,
  hasText: boolean,
  inputText: string, // Only used for IE10
  emojiPickerVisible: boolean,
  agentsAvailableOrSubscribed: boolean,
};

let updateTimer;
export class MessageForm extends Component<MessageFormProps, MessageFormState> {
  textArea: EmojiTextarea;
  props: MessageFormProps;
  state: MessageFormState = {
    simpleMode: isIE10() || isMobile(),
    hasText: false,
    emojiPickerVisible: false,
    inputText: '',
    agentsAvailableOrSubscribed: false,
  };
  checkAvailabilityTimer: number;

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

  componentWillReceiveProps(nextProps: MessageFormProps) {
    this.setState({
      agentsAvailableOrSubscribed: nextProps.agentsAvailable || QuiqChatClient.isUserSubscribed(),
    });
  }

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

    if (!this.state.agentsAvailableOrSubscribed || this.props.agentEndedConversation) {
      this.checkAvailability();
    }

    this.props.setMessageFieldFocused(false);
  }

  componentWillMount() {
    this.setState({
      agentsAvailableOrSubscribed: this.props.agentsAvailable || QuiqChatClient.isUserSubscribed(),
    });
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
    if (text) {
      QuiqChatClient.sendTextMessage(text);
    }

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
    if (this.state.simpleMode) {
      this.setState(
        state => ({inputText: `${state.inputText} ${emoji.native} `}),
        this.textArea.focus,
      );
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

    // On mobile devices, we need to scroll text area onto top of keyboard if in landscape
    if (this.state.simpleMode && this.textArea && getOrientation() === 'landscape') {
      window.scrollTo(0, this.textArea.input.offsetTop);
    }
  };

  handleMessageFieldLostFocus = () => {
    this.props.setMessageFieldFocused(false);

    this.props.setWindowScrollLockEnabled(true);
    window.scrollTo(0, 0);
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
            name: o.icon,
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
          name: this.props.muteSounds ? 'volume-up' : 'volume-off',
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
          name: 'envelope',
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
      !this.state.hasText || !this.state.agentsAvailableOrSubscribed || !allowConversationToStart;
    const emopjiPickerDisabled =
      !this.state.agentsAvailableOrSubscribed || !allowConversationToStart;
    const contentButtonsDisabled =
      !this.state.agentsAvailableOrSubscribed || !allowConversationToStart;
    const inputStyle = getStyle(styles.MessageFormInput, {fontFamily});
    const sendButtonStyle = getStyle(styles.MessageFormSend, {
      color: colors.primary,
      fontFamily,
    });
    const contentButtonStyle = getStyle(styles.ContentButtons, {
      color: '#848484',
      fontSize: '16px',
    });

    let messagePlaceholder = this.state.agentsAvailableOrSubscribed
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
            {this.state.simpleMode ? (
              <Input
                ref={element => {
                  this.textArea = element;
                }}
                inputStyle={inputStyle}
                value={this.state.inputText}
                maxLength={1024}
                autoFocus={!isMobile()}
                onBlur={this.handleMessageFieldLostFocus}
                onFocus={this.handleMessageFieldFocused}
                disabled={!this.state.agentsAvailableOrSubscribed || !allowConversationToStart}
                onChange={(e: SyntheticInputEvent<*>) => this.handleTextChanged(e.target.value)}
                onSubmit={this.addMessage}
                placeholder={messagePlaceholder}
              />
            ) : (
              <EmojiTextarea
                ref={n => {
                  this.textArea = n && n.wrappedInstance;
                }}
                style={inputStyle}
                disabled={!this.state.agentsAvailableOrSubscribed || !allowConversationToStart}
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
                disabled={contentButtonsDisabled}
                onClick={this.props.openFileBrowser}
                title={getMessage(intlMessageTypes.attachmentBtnTooltip)}
              >
                <i className="fa fa-paperclip" />
              </button>
            )}
            {this.props.configuration.enableEmojis &&
              EmojiUtils.emojisEnabledByCustomer() &&
              !isMobile() && (
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
    agentsAvailable: state.agentsAvailable,
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
