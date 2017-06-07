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

const assignQuiqObjInStandaloneMode = (): ?boolean => {
  if (!inStandaloneMode()) return;

  const queryString = window.location.href.split('?QUIQ=')[1];

  if (queryString) {
    const qsObj = qs.parse(atob(queryString));

    // At this point we can assume we are in standalone mode with a valid QUIQ objecft
    if (qsObj && qsObj.CONTACT_POINT && qsObj.HOST) {
      window.QUIQ = qsObj;
      return true;
    }
  }
};

const getQuiqObject = (): QuiqObject => {
  if (assignQuiqObjInStandaloneMode()) return window.QUIQ;

  const QUIQ = {
    CONTACT_POINT: 'default',
    COLOR: '#59ad5d',
    HEADER_TEXT: formatMessage(messages.hereToHelp),
    HOST: getHostUrl(),
    DEBUG: false,
    WELCOME_FORM: undefined,
    AUTO_POP_TIME: undefined,
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
