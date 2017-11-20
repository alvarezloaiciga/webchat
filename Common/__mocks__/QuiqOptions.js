// @flow

import messages from 'Common/Messages';
import type {QuiqObject} from 'Common/types';

const quiqOptions: QuiqObject = {
  displayMode: 'either',
  anchorElement: '',
  showDefaultLaunchButton: false,
  demoMode: false,
  agentsAvailableTimer: 60000,
  contactPoint: 'Bob',
  localStorageKeys: {},
  enforceAgentAvailability: true,
  host: 'https://bob.dev.centricient.corp',
  clientDomain: 'https://customer.com',
  color: '#333',
  colors: {
    primary: '#333',
    menuText: '#2199e8',
    eventText: '#ddd',
    agentMessageText: '#fff',
    agentMessageLinkText: '#fff',
    agentMessageBackground: '#0085f4',
    customerMessageText: '#555',
    customerMessageLinkText: '#0085f4',
    customerMessageBackground: '#f5f5f5',
    transcriptBackground: '#f4f4f8',
    attachmentMessageColor: '#9c9c9f',
    typingIndicatorForeground: '#2199e8',
    typingIndicatorBackground: '#66b9ef',
  },
  events: {
    showTime: true,
  },
  customScreens: {},
  styles: {
    HeaderMenu: {
      background: '#31bf8b',
    },
    HeaderBanner: {
      background: '#31bf8b',
      fontFamily: 'Source Sans Pro',
      fontSize: 16,
      fontWeight: 500,
      textTransform: 'uppercase',
    },
    ErrorBanner: {
      background: '#fff',
      color: 'red',
      fontFamily: 'Source Sans Pro',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
    ToggleChatButton: {
      background: 'teal',
    },
    ToggleChatButtonIcon: {
      opacity: 0.75,
    },
    CustomerMessageBubble: {
      background: '#68b588',
    },
    CustomerMessageText: {
      color: '#fff',
      fontFamily: 'Source Sans Pro',
    },
    AgentMessageBubble: {
      background: '#fff',
      border: '1px solid #e0e0e0',
    },
    AgentMessageText: {
      color: '#555',
      fontFamily: 'Source Sans Pro',
    },
    MessageForm: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      zIndex: 1,
    },
    MessageFormInput: {
      color: '#68b588',
      fontFamily: 'Source Sans Pro',
    },
    MessageFormSend: {
      color: '#68b588',
      textTransform: 'uppercase',
      fontFamily: 'Source Sans Pro',
      fontSize: 16,
    },
    WelcomeFormBanner: {
      height: 'auto',
      textAlign: 'left',
      padding: '8px 30px',
    },
    WelcomeFormField: {
      marginTop: 16,
    },
    WelcomeFormFieldLabel: {
      color: '#555',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontFamily: 'Source Sans Pro',
    },
    WelcomeFormFieldInput: {
      outline: 'none',
      color: '#555',
      fontFamily: 'Source Sans Pro',
    },
    WelcomeFormFieldSelect: {
      outline: 'none',
      color: '#555',
      fontFamily: 'Source Sans Pro',
    },
    WelcomeFormFieldOption: {
      outline: 'none',
      color: '#555',
      fontFamily: 'Source Sans Pro',
    },
    WelcomeFormFieldTextarea: {
      outline: 'none',
      color: '#888',
      fontFamily: 'Source Sans Pro',
    },
    WelcomeFormSubmitButton: {
      background: 'teal',
      fontWeight: 700,
      fontFamily: 'Source Sans Pro',
      fontSize: 16,
    },
    OptionsMenuButton: {
      background: 'red',
    },
    OptionsMenuButtonIcon: {
      display: 'none',
    },
    EmailTranscriptMenuContainer: {
      backround: 'green',
    },
    EmailTranscriptMenuLineItem: {
      fontFamily: 'Comic Sans',
    },
    EmailTranscriptMenuLineItemIcon: {
      fontSize: 20,
    },
    EmailTranscriptInputContainer: {
      border: '1px solid black',
    },
    EmailTranscriptInput: {
      outline: 'none',
    },
    EmailTranscriptInputCancelButton: {
      borderRadius: '10px',
    },
    EmailTranscriptInputSubmitButton: {
      borderRadius: '10px',
    },
    InlineActionButton: {
      backgroundColor: 'grey',
    },
    EventContainer: {
      backgroundColor: 'green',
    },
    EventText: {
      color: 'red',
    },
    EventLine: {
      stroke: 'red',
    },
    TypingIndicatorSvgStyle: {
      fill: 'red',
    },
    TypingIndicatorCircleStyle: {
      fill: 'green',
    },
  },
  position: {},
  headerText: 'TOOL TIME',
  messages: {
    pageTitle: messages.pageTitle,
    titleText: 'Quiq Webchat',
    headerText: messages.hereToHelp,
    sendButtonLabel: messages.send,
    messageFieldPlaceholder: messages.sendUsAMessage,
    welcomeFormValidationErrorMessage: messages.welcomeFormValidationError,
    welcomeFormSubmitButtonLabel: messages.submitWelcomeForm,
    welcomeFormSubmittingButtonLabel: messages.submittingWelcomeForm,
    agentTypingMessage: messages.agentIsTyping,
    agentEndedConversationMessage: messages.agentEndedConversation,
    agentsNotAvailableMessage: messages.agentsNotAvailable,
    connectingMessage: messages.connecting,
    reconnectingMessage: messages.reconnecting,
    inactiveMessage: messages.clientInactive,
    errorMessage: messages.errorState,
    requiredFieldAriaLabel: messages.required,
    minimizeWindowTooltip: messages.minimizeWindow,
    dockWindowTooltip: messages.dockWindow,
    openInNewWindowTooltip: messages.openInNewWindow,
    closeWindowTooltip: messages.closeWindow,
    emojiPickerTooltip: messages.emojiPickerTooltip,
    optionsMenuTooltip: messages.optionsMenuTooltip,
    emailTranscriptMenuMessage: messages.emailTranscriptMenuMessage,
    emailTranscriptMenuTooltip: messages.emailTranscriptMenuTooltip,
    emailTranscriptInputPlaceholder: messages.emailTranscriptInputPlaceholder,
    emailTranscriptInputCancelTooltip: messages.emailTranscriptInputCancelTooltip,
    emailTranscriptInputSubmitTooltip: messages.emailTranscriptInputSubmitTooltip,
    emailTranscriptInlineButton: messages.emailTranscriptInlineButton,
    messageArrivedNotification: messages.messageArrivedNotification,
    transcriptEmailedEventMessage: messages.transcriptEmailedEventMessage,
    attachmentBtnTooltip: messages.attachmentBtnTooltip,
    invalidAttachmentMessage: messages.invalidAttachmentMessage,
    attachmentUploadError: messages.attachmentUploadError,
    muteSounds: messages.muteSounds,
    unmuteSounds: messages.unmuteSounds,
    muteSoundsTooltip: messages.muteSoundsTooltip,
    unmuteSoundsTooltip: messages.unmuteSoundsTooltip,
  },
  fontFamily: 'Lato, sans-serif',
  width: 400,
  height: 600,
  debug: false,
  autoPopTime: 2000,
  href: window.location.href,
  customLaunchButtons: [],
  mobileNumber: 123,
  welcomeForm: {
    headerText:
      'Thanks for contacting us! Please fill out a couple brief pieces of information and we will get you chatting with an agent.',
    fields: [
      {
        type: 'text',
        label: 'First Name',
        id: 'firstName',
        required: true,
        additionalProperties: {},
      },
      {
        type: 'text',
        label: 'Last Name',
        id: 'lastName',
        required: false,
        isInitialMessage: true,
        additionalProperties: {},
      },
      {
        type: 'number',
        label: 'Number Field',
        id: 'numberField',
        required: false,
        additionalProperties: {},
      },

      {
        type: 'email',
        label: 'E-Mail',
        id: 'email',
        required: false,
        additionalProperties: {},
      },
      {
        type: 'tel',
        label: 'Phone Number',
        id: 'phoneNumber',
        required: false,
        additionalProperties: {},
      },
      {
        type: 'textarea',
        label: 'My life story',
        id: 'lifeStory',
        required: false,
        additionalProperties: {},
      },
      {
        type: 'select',
        label: 'Country',
        id: 'country',
        required: true,
        additionalProperties: {},
      },
    ],
  },
  excludeEmojis: ['hankey'],
  _internal: {},
};

export const openStandaloneMode = jest.fn();
export const validateWelcomeFormDefinition = jest.fn();

export const getStyle = (style?: Object = {}, defaults?: Object = {}) =>
  Object.assign({}, defaults, style);

export const getMessage = (messageName: string): string => {
  const message = quiqOptions.messages[messageName];

  if (!message) throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return message.defaultMessage || message;
};

export default quiqOptions;
