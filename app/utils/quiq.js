// @flow
declare var __DEV__: string;
import messages from 'messages';
import {formatMessage} from 'utils/i18n';
import {
  getWebchatUrlFromScriptTag,
  displayError,
  inStandaloneMode,
  isIE9,
  isIEorSafari,
} from './utils';
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
  if (!navigator.cookieEnabled) {
    return displayError(messages.cookiesMustBeEnabledError);
  }

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
    FONT_FAMILY: 'sans-serif',
    CUSTOM_LAUNCH_BUTTONS: [],
  };

  if (!window.QUIQ) {
    return QUIQ;
  }

  // Ensure host is defined for standalone mode,
  // since we won't be able to get it from a script tag.
  window.QUIQ.HOST = QUIQ.HOST;
  // Don't AutoPop IE/Safari since they are always in standalone mode.
  window.QUIQ.AUTO_POP_TIME = isIEorSafari() ? undefined : window.QUIQ.AUTO_POP_TIME;

  return Object.assign({}, QUIQ, window.QUIQ);
};
const QUIQ: QuiqObject = getQuiqObject();

let standaloneWindowTimer;
export const openStandaloneMode = (
  onPop?: (fireEvent: boolean) => void,
  onDock?: (fireEvent: boolean) => void,
) => {
  if (window.QUIQ_STANDALONE_WINDOW_HANDLE) {
    window.QUIQ_STANDALONE_WINDOW_HANDLE.focus();
    if (onPop) onPop(false);

    return;
  }

  const width = 400;
  const height = 600;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  window.QUIQ_STANDALONE_WINDOW_HANDLE = open(
    `${__DEV__
      ? 'http://localhost:3000'
      : QUIQ.HOST}/app/webchat/standalone?QUIQ=${encodeURIComponent(JSON.stringify(QUIQ))}`, // eslint-disable-line no-restricted-syntax
    isIE9() ? '_blank' : 'quiq-standalone-webchat',
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`,
  );
  window.QUIQ_STANDALONE_WINDOW_HANDLE.focus();
  if (onPop) onPop(false);

  /*
     * Since we popped open webchat into a new window in standalone mode,
     * this instance now needs to start listening for if that new window closes.
     * If it does, we re-open this instance, since the user re-docked the standalone window
     */
  if (standaloneWindowTimer) clearInterval(standaloneWindowTimer);
  standaloneWindowTimer = setInterval(() => {
    if (window.QUIQ_STANDALONE_WINDOW_HANDLE.closed) {
      if (standaloneWindowTimer) clearInterval(standaloneWindowTimer);
      standaloneWindowTimer = undefined;
      window.QUIQ_STANDALONE_WINDOW_HANDLE = undefined;
      if (onDock) onDock(false);
    }
  }, 500);
};

export default QUIQ;
