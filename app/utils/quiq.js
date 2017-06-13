// @flow

import messages from 'messages';
import {formatMessage} from 'utils/i18n';
import {getWebchatUrlFromScriptTag, displayError, inStandaloneMode} from './utils';
import {SupportedWebchatUrls} from 'appConstants';
import qs from 'qs';
import type {QuiqObject} from 'types';

const getHostUrl = (): string => {
  // Host will already be defined in standalone mode
  if (window.QUIQ && window.QUIQ.HOST) return window.QUIQ.HOST;

  const url = SupportedWebchatUrls.find(u => window.location.href.includes(u))
    ? window.location.href
    : getWebchatUrlFromScriptTag();

  const host = url.slice(0, url.indexOf('/app/webchat'));

  if (!host) return displayError(messages.cannotFindScript);

  return host;
};

const assignQuiqObjInStandaloneMode = () => {
  if (!inStandaloneMode()) return;

  const queryString = qs.parse(window.location.href.split('?')[1]);
  if (!queryString || !queryString.QUIQ) return displayError(messages.standaloneFatalError);

  try {
    const QUIQ = JSON.parse(queryString.QUIQ);
    window.QUIQ = QUIQ;
  } catch (e) {
    return displayError(messages.errorParsingStandaloneObject);
  }
};

const getQuiqObject = (): QuiqObject => {
  assignQuiqObjInStandaloneMode();

  const QUIQ = {
    CONTACT_POINT: 'default',
    COLOR: '#59ad5d',
    HEADER_TEXT: formatMessage(messages.hereToHelp),
    HOST: getHostUrl(),
    DEBUG: false,
    WELCOME_FORM: undefined,
    AUTO_POP_TIME: undefined,
    HREF: window.location.href, // Standalone uses this to determine original host URL for welcome form
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
