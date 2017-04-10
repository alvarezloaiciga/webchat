// @flow
import { defineMessages } from 'react-intl';
import { formatMessage } from 'core-ui/services/i18nService';
import { UAParser } from 'ua-parser-js';
import type { QuiqObject, BrowserNames, DeviceTypes, OSNames } from 'types';

const parser = new UAParser();
const messages = defineMessages({
  noQuiqObject: {
    name: 'noQuiqObject',
    description: 'Error to display when the global QUIQ object is undefined',
    defaultMessage: 'Quiq Fatal Error! window.QUIQ object is missing. Please contact your administrator.',
  },
  quiqFatalError: {
    name: 'quiqFatalError',
    description: 'Message to show a quiq fatal error',
    defaultMessage: 'QUIQ FATAL ERROR',
  },
  missingQuiqProps: {
    name: 'missingQuiqProps',
    description: 'Message to display when there are properties missing on the QUIQ global object',
    defaultMessage: `The following properties are missing on the window.QUIQ object
      {missingProps}
    Please contact your administrator`,
  },
  hereToHelp: {
    id: 'hereToHelp',
    description: 'Welcome message to display at top of webchat',
    defaultMessage: "We're here to help if you have any questions!",
  },
});

const getQuiqObject = (): QuiqObject => { // eslint-disable-line import/prefer-default-export
  if (!window.QUIQ) {
    throw new Error(formatMessage(messages.noQuiqObject));
  }

  const properties = [
    'CONTACT_POINT',
    'TENANT',
  ];

  const missingProps = properties.filter((prop) => !window.QUIQ[prop]).join('\n    ');
  if (missingProps.length) {
    throw new Error(`\n
!!! ${formatMessage(messages.quiqFatalError)} !!!
  ${formatMessage(messages.missingQuiqProps)}
!!! ${formatMessage(messages.quiqFatalError)} !!!\n`);
  }

  const quiq = window.QUIQ;

  quiq.HOST = quiq.HOST || 'goquiq.com';
  quiq.COLOR = quiq.COLOR || '#59ad5d';
  quiq.HEADER_TEXT = quiq.HEADER_TEXT || formatMessage(messages.hereToHelp);

  return window.QUIQ;
};
export const QUIQ: QuiqObject = getQuiqObject();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();
