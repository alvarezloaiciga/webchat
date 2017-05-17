// @flow
import type {Message, IntlObject, IntlMessage} from 'types';

export const getMockMessage = (
  // eslint-disable-line import/prefer-default-export
  id?: number = 0,
  overrides?: Message | {} = {},
) => {
  const message = {
    authorType: id % 2 === 0 ? 'Customer' : 'Agent',
    text: `text--${id}`,
    id: `id--${id}`,
    timestamp: id,
    type: 'Text',
  };

  return Object.assign(message, overrides);
};

/**
 * Stub out formatMessage so that it will return the defaultMessage with basic variable replacement
 */
const formatTestMessage = (msg: IntlMessage, values?: {[key: string]: string}) => {
  if (!values) {
    return msg.defaultMessage;
  }

  let returnValue = msg.defaultMessage;
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
