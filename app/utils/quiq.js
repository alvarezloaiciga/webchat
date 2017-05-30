// @flow

import messages from 'messages';
import {formatMessage} from 'core-ui/services/i18nService';
import {getWebchatUrl, displayError} from './utils';
import type {QuiqObject} from 'types';

const getHostFromScriptTag = (): string => {
  // Host will already be defined in standalone mode
  if (window.QUIQ && window.QUIQ.HOST) return window.QUIQ.HOST;

  const url = getWebchatUrl();
  const host = url.slice(0, url.indexOf('/app/webchat'));
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
    AUTO_POP_TIME: undefined,
    STANDALONE_MODE: false,
  };

  if (!window.QUIQ) {
    return QUIQ;
  }

  // Ensure host is defined for standalone mode,
  // since we won't be able to get it from a script tag.
  window.QUIQ.HOST = QUIQ.HOST;

  return Object.assign({}, QUIQ, window.QUIQ);
};

const QUIQ: QuiqObject = getQuiqObject();
export default QUIQ;
