// @flow
declare var __DEV__: string;

import {defineMessages} from 'react-intl';
import {formatMessage} from 'core-ui/services/i18nService';
import {SupportedWebchatUrls} from 'appConstants';
import type {QuiqObject, IntlMessage} from 'types';

const messages = defineMessages({
  cannotFindScript: {
    name: 'cannotFindScript',
    description: "Error to display when we can't find the script that loaded webchat",
    defaultMessage: 'Cannot find script that loaded Webchat. Please contact your administrator.',
  },
  cannotDetermineHost: {
    name: 'cannotDetermineHost',
    description: "Error to display when we can't determine the hostname from the script src attribute",
    defaultMessage: 'Cannot determine host from script url. Please contact your administrator',
  },
  quiqFatalError: {
    name: 'quiqFatalError',
    description: 'Message to show a quiq fatal error',
    defaultMessage: 'QUIQ FATAL ERROR',
  },
  hereToHelp: {
    id: 'hereToHelp',
    description: 'Welcome message to display at top of webchat',
    defaultMessage: "We're here to help if you have any questions!",
  },
});

const displayError = (error: IntlMessage) => {
  throw new Error(
    `\n
!!! ${formatMessage(messages.quiqFatalError)} !!!
  ${formatMessage(error)}
!!! ${formatMessage(messages.quiqFatalError)} !!!\n`,
  );
};

const getHostFromScriptTag = (): string => {
  // eslint-disable-line no-unused-vars
  // Local Development should just always supply HOST manually for simplicity
  // Also catches cases when running standalone built webchat locally
  if (
    __DEV__ ||
    window.location.hostname === 'localhost' ||
    window.location.origin === 'file://' ||
    window.location.hostname === 'mymac'
  ) {
    if (!window.QUIQ || !window.QUIQ.HOST) {
      throw new Error('You must specify window.QUIQ.HOST when running locally!');
    }
    return window.QUIQ.HOST;
  }

  // Determine host from the script tag that loaded webchat
  const scriptTags = Array.from(document.getElementsByTagName('script'));
  const mainScript = scriptTags.find(
    tag => tag.src && SupportedWebchatUrls.find(u => tag.src.toLowerCase().includes(u)),
  );

  if (!mainScript) return displayError(messages.cannotFindScript);

  const host = mainScript.src.slice(0, mainScript.src.indexOf('/app/webchat'));
  if (!host) return displayError(messages.cannotFindScript);

  return host;
};

const getQuiqObject = (): QuiqObject => {
  const QUIQ = {
    CONTACT_POINT: 'default',
    COLOR: '#59ad5d',
    HEADER_TEXT: formatMessage(messages.hereToHelp),
    HOST: getHostFromScriptTag(),
    DEBUG: false,
    WELCOME_FORM: undefined,
  };

  if (!window.QUIQ) {
    return QUIQ;
  }

  return Object.assign({}, QUIQ, window.QUIQ);
};

const QUIQ: QuiqObject = getQuiqObject();
export default QUIQ;
