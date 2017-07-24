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
  camelize,
} from './utils';
import {SupportedWebchatUrls} from 'appConstants';
import qs from 'qs';
import type {QuiqObject, WelcomeForm} from 'types';

const reservedKeyNames = ['Referrer'];

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

const processCustomCss = (url: string): void => {
  // Verify that this is an HTTPS url (required to avoid mixed content warnings)
  if (!url.startsWith('https')) return displayError(messages.cssHttpsError);

  const link = document.createElement('link');
  link.href = url;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
};

const processWelcomeForm = (form: WelcomeForm): void => {
  const newFormObject = Object.assign({}, form);
  if (form.fields) {
    newFormObject.fields.forEach(field => {
      // Ensure that id is defined. If not, use camel-cased version of label.
      // If label is not defined this is an error, and will be caught when WELCOME_FORM is validated.
      if (!field.id && field.label) field.id = camelize(field.label);
    });
  }
  window.QUIQ.WELCOME_FORM = newFormObject;
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

  const primaryColor =
    (window.QUIQ && window.QUIQ.COLORS && window.QUIQ.COLORS.primary) ||
    (window.QUIQ && window.QUIQ.COLOR) ||
    '#59ad5d';

  const QUIQ = {
    CONTACT_POINT: 'default',
    COLOR: primaryColor,
    COLORS: {
      primary: primaryColor,
      agentMessageText: '#000',
      agentMessageLinkText: '#2199e8',
      agentMessageBackground: '#fff',
      customerMessageText: '#fff',
      customerMessageLinkText: '#fff',
      customerMessageBackground: primaryColor,
      transcriptBackground: '#f4f4f8',
    },
    HEADER_TEXT: formatMessage(messages.hereToHelp),
    HOST: getHostUrl(),
    DEBUG: false,
    WELCOME_FORM: undefined,
    AUTO_POP_TIME: undefined,
    HREF: window.location.href, // Standalone uses this to determine original host URL for welcome form
    FONT_FAMILY: 'sans-serif',
    WIDTH: 400,
    HEIGHT: 600,
    CUSTOM_LAUNCH_BUTTONS: [],
    MOBILE_NUMBER: undefined,
  };

  if (!window.QUIQ) {
    return QUIQ;
  }

  // If welcome form is defined, process it
  if (window.QUIQ.WELCOME_FORM) {
    processWelcomeForm(window.QUIQ.WELCOME_FORM);
  }

  // If custom css url is defined in DEBUG, process it
  if (window.QUIQ.DEBUG && window.QUIQ.DEBUG.CUSTOM_CSS_URL)
    processCustomCss(window.QUIQ.DEBUG.CUSTOM_CSS_URL);

  // Ensure host is defined for standalone mode,
  // since we won't be able to get it from a script tag.
  window.QUIQ.HOST = QUIQ.HOST;
  // Don't AutoPop IE/Safari since they are always in standalone mode.
  window.QUIQ.AUTO_POP_TIME = isIEorSafari() ? undefined : window.QUIQ.AUTO_POP_TIME;
  window.QUIQ.CUSTOM_LAUNCH_BUTTONS = inStandaloneMode()
    ? []
    : window.QUIQ.CUSTOM_LAUNCH_BUTTONS || [];

  const returnValue = Object.assign({}, QUIQ, window.QUIQ, {
    COLOR: primaryColor,
    COLORS: Object.assign({}, QUIQ.COLORS, window.QUIQ.COLORS),
  });

  return returnValue;
};

const QUIQ: QuiqObject = getQuiqObject();

export const validateWelcomeFormDefinition = (): void => {
  const form = QUIQ.WELCOME_FORM;
  if (!form) return;

  if (!form.fields || !Array.isArray(form.fields)) {
    displayError(messages.invalidWelcomeFormArray);
  }

  if (form.fields.length > 20) {
    displayError(messages.invalidWelcomeFormFieldCount);
  }

  form.fields.reduce((uniqueKeys, f) => {
    // Ensure field has an id, label and type
    // Note that we previously try and build an id from the label if an id was not provided
    if (!f.label || !f.id || !f.type) {
      displayError(messages.invalidWelcomeFormUndefined, {id: f.id, label: f.label});
    }

    // Ensure id meets key-length requirements
    if (f.id.length > 80) {
      displayError(messages.invalidWelcomeFormDefinitionKeyLength, {id: f.id});
    }

    // Ensure key is unique
    if (uniqueKeys.includes(f.id)) {
      displayError(messages.invalidWelcomeFormDefinitionKeyUniqueness);
    }

    // Ensure id field is not in the list of reserved words
    if (reservedKeyNames.includes(f.id)) {
      displayError(messages.invalidWelcomeFormDefinitionKeyReserved, {id: f.id});
    }

    return uniqueKeys.concat(f.id);
  }, []);
};

let standaloneWindowTimer;
export const openStandaloneMode = (callbacks: {
  onPop: () => void,
  onFocus: () => void,
  onDock: () => void,
}) => {
  if (window.QUIQ_STANDALONE_WINDOW_HANDLE) {
    window.QUIQ_STANDALONE_WINDOW_HANDLE.focus();
    return callbacks.onFocus();
  }

  const width = QUIQ.WIDTH;
  const height = QUIQ.HEIGHT;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  window.QUIQ_STANDALONE_WINDOW_HANDLE = open(
    `${__DEV__
      ? 'http://localhost:3000'
      : QUIQ.HOST}/app/webchat/standalone?QUIQ=${encodeURIComponent(JSON.stringify(QUIQ))}`,
    isIE9() ? '_blank' : 'quiq-standalone-webchat',
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`,
  );
  window.QUIQ_STANDALONE_WINDOW_HANDLE.focus();
  callbacks.onPop();

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
      callbacks.onDock();
    }
  }, 500);
};

export default QUIQ;
