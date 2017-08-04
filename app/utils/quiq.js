// @flow
declare var __DEV__: string;
import messages from 'messages';
import {getDisplayString} from 'utils/i18n';
import QuiqChatClient from 'quiq-chat';
import {getWebchatUrlFromScriptTag, displayError, isIEorSafari, inStandaloneMode, camelize} from './utils';
import {SupportedWebchatUrls, StandaloneWindowName} from 'appConstants';
import type {QuiqObject, WelcomeForm} from 'types';

const reservedKeyNames = ['Referrer'];

const getHostUrl = (quiqObj: QuiqObject): string => {
  if (
    __DEV__ ||
    window.location.hostname === 'localhost' ||
    window.location.origin === 'file://' ||
    window.location.hostname === 'mymac'
  ) {
    if (!quiqObj.HOST) {
      throw new Error('You must specify window.QUIQ.HOST when running locally!');
    }

    return quiqObj.HOST;
  }

  return window.location.href.slice(0, window.location.href.indexOf('/app/webchat'));
};

const processWelcomeForm = (form: WelcomeForm): WelcomeForm => {
  const newFormObject = Object.assign({}, form);
  if (form.fields) {
    newFormObject.fields.forEach(field => {
      // Ensure that id is defined. If not, use camel-cased version of label. (This is for backwards compatibility)
      // If label is not defined this is an error, and will be caught when WELCOME_FORM is validated.
      if (!field.id && field.label) field.id = camelize(field.label);
    });
  }

  return newFormObject;
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


const getQuiqObject = (): QuiqObject => {
  if (!navigator.cookieEnabled) {
    return displayError(messages.cookiesMustBeEnabledError);
  }

  const rawQuiqObject = JSON.parse(localStorage.getItem('QUIQ') || '');
  const primaryColor =
    (rawQuiqObject.COLORS && rawQuiqObject.COLORS.primary) || rawQuiqObject.COLOR || '#59ad5d';
  const QUIQ = {
    CONTACT_POINT: 'default',
    COLOR: primaryColor,
    COLORS: Object.assign(
      {},
      {
        primary: primaryColor,
        agentMessageText: '#000',
        agentMessageLinkText: '#2199e8',
        agentMessageBackground: '#fff',
        customerMessageText: '#fff',
        customerMessageLinkText: '#fff',
        customerMessageBackground: primaryColor,
        transcriptBackground: '#f4f4f8',
      },
      rawQuiqObject.COLORS,
    ),
    STYLES: {},
    POSITION: {},
    HEADER_TEXT: messages.hereToHelp,
    HOST: getHostUrl(rawQuiqObject),
    DEBUG: false,
    WELCOME_FORM: rawQuiqObject.WELCOME_FORM
      ? processWelcomeForm(rawQuiqObject.WELCOME_FORM)
      : undefined,
    AUTO_POP_TIME: isIEorSafari() ? undefined : rawQuiqObject.AUTO_POP_TIME,
    HREF: window.location.href, // Standalone uses this to determine original host URL for welcome form
    FONT_FAMILY: 'sans-serif',
    WIDTH: 400,
    HEIGHT: 600,
    CUSTOM_LAUNCH_BUTTONS: inStandaloneMode() ? [] : rawQuiqObject.CUSTOM_LAUNCH_BUTTONS || [],
    MOBILE_NUMBER: undefined,
    MESSAGES: Object.assign(
      {},
      {
        headerText: rawQuiqObject.HEADER_TEXT || messages.hereToHelp,
        sendButtonLabel: messages.send,
        messageFieldPlaceholder: messages.sendUsAMessage,
        welcomeFormValidationErrorMessage: messages.welcomeFormValidationError,
        welcomeFormSubmitButtonLabel: messages.submitWelcomeForm,
        welcomeFormSubmittingButtonLabel: messages.submittingWelcomeForm,
        agentTypingMessage: messages.agentIsTyping,
        connectingMessage: messages.connecting,
        reconnectingMessage: messages.reconnecting,
        errorMessage: messages.errorState,
        requiredFieldAriaLabel: messages.required,
        minimizeWindowTooltip: messages.minimizeWindow,
        dockWindowTooltip: messages.dockWindow,
        openInNewWindowTooltip: messages.openInNewWindow,
        closeWindowTooltip: messages.closeWindow,
      },
      rawQuiqObject.MESSAGES,
    ),
  };

  if (!window.QUIQ) {
    return QUIQ;
  }

  // Merge MESSAGES separately, as Object.assign() does not do deep cloning
  if (rawQuiqObject.MESSAGES)
    window.QUIQ.MESSAGES = Object.assign({}, QUIQ.MESSAGES, window.QUIQ.MESSAGES);

  // If welcome form is defined, process it
  if (rawQuiqObject.WELCOME_FORM) {
    processWelcomeForm(window.QUIQ.WELCOME_FORM);
  }

  // If custom css url is defined in DEBUG, process it
  if (rawQuiqObject.DEBUG && rawQuiqObject.DEBUG.CUSTOM_CSS_URL)
    processCustomCss(rawQuiqObject.DEBUG.CUSTOM_CSS_URL);

  rawQuiqObject.CUSTOM_LAUNCH_BUTTONS = inStandaloneMode()
    ? []
    : rawQuiqObject.CUSTOM_LAUNCH_BUTTONS || [];

  const returnValue = Object.assign({}, QUIQ, rawQuiqObject);
  localStorage.setItem('QUIQ', JSON.stringify(returnValue));
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

    // Ensure type is supported
    if (!['text', 'number', 'email', 'tel', 'textarea'].includes(f.type)) {
      displayError(messages.invalidWelcomeFormFieldType, {type: f.type});
    }

    // Ensure that if 'rows' is defined, it is of numeric type
    if (f.type === 'textarea' && f.rows && typeof f.rows !== 'number') {
      displayError(messages.invalidWelcomeFormFieldRowsType);
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
  const url = `${__DEV__ ? 'http://localhost:3000' : QUIQ.HOST}/app/webchat/index.html`;
  const params = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  window.QUIQ_STANDALONE_WINDOW_HANDLE = open(url, StandaloneWindowName, params);
  window.QUIQ_STANDALONE_WINDOW_HANDLE.onload = function () {
    window.QUIQ_STANDALONE_WINDOW_HANDLE.postMessage({QUIQ}, url);
  };
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
      QuiqChatClient.start();
    }
  }, 500);
};

/**
 * Strips out styles that would be difficult to keep backwards compatibility for
 */
export const getStyle = (userStyle?: Object = {}, defaults?: Object = {}) => {
  const unsupportedStyles = [
    'float',
    'clear',
    'top',
    'bottom',
    'left',
    'right',
    'position',
    'transform',
    'content',
  ];

  Object.keys(userStyle).forEach(property => {
    if (unsupportedStyles.includes(property)) {
      throw new Error(`Your style is using the unsupported style property '${property}'.`);
    }

    if (property === 'fontFamily' && userStyle.fontFamily) {
      const font = userStyle.fontFamily;

      ['Comic Sans', 'Papyrus'].forEach(badFont => {
        if (typeof font === 'string' && font.includes(badFont)) {
          // eslint-disable-next-line no-console
          console.warn(
            `The font ${badFont} is deprecated because it leads to a poor user experience.`,
          );
        }
      });
    }
  });

  return Object.assign({}, defaults, userStyle);
};

export const getMessage = (messageName: string): string => {
  const message = QUIQ.MESSAGES[messageName];

  if (!message) throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return getDisplayString(message);
};

export default QUIQ;
