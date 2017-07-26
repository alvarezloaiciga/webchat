// @flow
import messages from 'messages';
import {getDisplayString} from 'utils/i18n';
import type {QuiqObject} from 'types';

const QUIQ: QuiqObject = {
  CONTACT_POINT: 'Bob',
  HOST: 'https://bob.dev.centricient.corp',
  COLOR: '#333',
  COLORS: {
    primary: '#333',
    agentMessageText: '#fff',
    agentMessageLinkText: '#fff',
    agentMessageBackground: '#0085f4',
    customerMessageText: '#555',
    customerMessageLinkText: '#0085f4',
    customerMessageBackground: '#f5f5f5',
    transcriptBackground: '#f4f4f8',
  },
  MESSAGES: {
    HEADER_TEXT: messages.hereToHelp,
    SEND_BUTTON_LABEL: messages.send,
    MESSAGE_FIELD_PLACEHOLDER: messages.sendUsAMessage,
    WELCOME_FORM_VALIDATION_ERROR_MESSAGE: messages.welcomeFormValidationError,
    WELCOME_FORM_SUBMIT_BUTTON_LABEL: messages.submitWelcomeForm,
    WELCOME_FORM_SUBMITTING_BUTTON_LABEL: messages.submittingWelcomeForm,
    AGENT_TYPING_MESSAGE: messages.agentIsTyping,
    CONNECTING_MESSAGE: messages.connecting,
    RECONNECTING_MESSAGE: messages.reconnecting,
    ERROR_MESSAGE: messages.errorState,
    REQUIRED_FIELD_ARIA_LABEL: messages.required,
    MINIMIZE_WINDOW_TOOLTIP: messages.minimizeWindow,
    DOCK_WINDOW_TOOLTIP: messages.dockWindow,
    OPEN_IN_NEW_WINDOW_TOOLTIP: messages.openInNewWindow,
    CLOSE_WINDOW_TOOLTIP: messages.closeWindow,
  },
  FONT_FAMILY: 'Lato, sans-serif',
  WIDTH: 400,
  HEIGHT: 600,
  DEBUG: false,
  AUTO_POP_TIME: 2000,
  HREF: window.location.href,
  CUSTOM_LAUNCH_BUTTONS: [],
  MOBILE_NUMBER: 123,
  WELCOME_FORM: {
    headerText:
      'Thanks for contacting us! Please fill out a couple brief pieces of information and we will get you chatting with an agent.',
    fields: [
      {
        type: 'text',
        label: 'First Name',
        id: 'firstName',
        required: true,
      },
      {
        type: 'text',
        label: 'Last Name',
        id: 'lastName',
        required: false,
      },
      {
        type: 'number',
        label: 'Number Field',
        id: 'numberField',
        required: false,
      },

      {
        type: 'email',
        label: 'E-Mail',
        id: 'email',
        required: false,
      },
      {
        type: 'tel',
        label: 'Phone Number',
        id: 'phoneNumber',
        required: false,
      },
      {
        type: 'textarea',
        label: 'My life story',
        id: 'lifeStory',
        required: false,
      },
    ],
  },
};

export const openStandaloneMode = jest.fn();
export const validateWelcomeFormDefinition = jest.fn();

export const getMessage = (messageName: string): string => {
  const message = QUIQ.MESSAGES[messageName];

  if (!message) throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return getDisplayString(message);
};
export default QUIQ;
