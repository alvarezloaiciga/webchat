// @flow
import quiqOptions from 'Common/__mocks__/QuiqOptions';

import type {IntlObject, IntlMessage, TextMessage, Event, ChatConfiguration} from 'Common/types';

export const getMockMessage = (
  // eslint-disable-line import/prefer-default-export
  id?: number = 0,
  overrides?: TextMessage | {} = {},
): TextMessage => {
  const message: TextMessage = {
    authorType: id % 2 === 0 ? 'Customer' : 'User',
    text: `text--${id}`,
    id: `id--${id}`,
    timestamp: id,
    type: 'Text',
    authorDisplayName: 'Homer S.',
    authorProfilePicture: 'https://mypictures.com/pic.png',
  };

  return Object.assign({}, message, overrides);
};

export const getMockEvent = (id?: number = 0, overrides?: Event | {} = {}): Event => {
  const event: Event = {
    id: `id--${id}`,
    timestamp: id,
    type: 'SendTranscript',
  };

  return Object.assign({}, event, overrides);
};

/**
 * Stub out formatMessage so that it will return the defaultMessage with basic variable replacement
 */
const formatTestMessage = (msg: IntlMessage, values: ?{[key: string]: string}) => {
  if (!values) {
    return msg.defaultMessage || '';
  }

  let returnValue = msg.defaultMessage || '';
  Object.keys(values).forEach(key => {
    if (values) {
      const value = values[key];
      returnValue = returnValue.replace(`{${key}}`, value);
    }
  });

  return returnValue;
};

export const TestIntlObject: IntlObject = {
  formatMessage: formatTestMessage,
  formatRelative: value => value.toString(),
  formatTime: timestamp => timestamp.toString(),
  formatDate: timestamp => timestamp.toString(),
};

export const mockLocation = () => {
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: '',
  });
  Object.defineProperty(window.location, 'hash', {
    writable: true,
    value: '',
  });
  Object.defineProperty(window.location, 'hostname', {
    writable: true,
    value: '',
  });
};

export const getMockConfiguration = (overrides?: *): ChatConfiguration =>
  Object.assign(
    {},
    {
      enableChatEmailTranscript: false,
      enableChatFileAttachments: false,
      enableManualConvoStart: false,
      enableMobileChat: false,
      supportedAttachmentTypes: ['image/png,image/jpeg'],
      whitelistedDomains: '',
      enableEmojis: false,
      playSoundOnNewMessage: false,
      flashNotificationOnNewMessage: false,
      registrationForm: {
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
      customMenuItems: [],
      menuOffset: undefined,
      menuOptions: {
        customItems: [],
      },
    },
    quiqOptions,
    overrides,
  );
