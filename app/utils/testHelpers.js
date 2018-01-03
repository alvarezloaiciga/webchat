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
      registrationForm: null,
      customMenuItems: [],
      menuOffset: undefined,
      menuOptions: {
        customItems: [],
      },
    },
    quiqOptions,
    overrides,
  );
