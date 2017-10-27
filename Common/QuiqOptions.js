// @flow
import messages from 'Common/Messages';
import {
  displayError,
  camelize,
  setLocalStorageItemsIfNewer,
  getWebchatHostFromScriptTag,
  getWindowDomain,
  getQuiqKeysFromLocalStorage,
  isStorageEnabled,
} from 'Common/Utils';
import {getDisplayString} from 'Common/i18n';
import {MenuItemKeys} from 'Common/Constants';
import type {QuiqObject, WelcomeForm} from 'Common/types';

const reservedKeyNames = ['Referrer'];

// This should be called from the client site, by the SDK.
// If called from within the webchat Iframe, some of the default values don't make sense.
export const buildQuiqObject = (rawQuiqObject: Object): QuiqObject => {
  let host = rawQuiqObject.host;
  if (host) {
    if (host.endsWith('/')) {
      host = host.slice(0, -1);
    }
  } else {
    host = getWebchatHostFromScriptTag();
  }

  const primaryColor =
    (rawQuiqObject.colors && rawQuiqObject.colors.primary) || rawQuiqObject.color || '#59ad5d';
  const contactPoint = rawQuiqObject.contactPoint || 'default';
  const quiqOptions = {
    agentsAvailableTimer:
      rawQuiqObject.agentsAvailableTimer && rawQuiqObject.agentsAvailableTimer >= 60000
        ? rawQuiqObject.agentsAvailableTimer
        : 60000,
    contactPoint,
    // Transfer Quiq keys from this site's localStorage to iframe's local storage.
    // We search for non-contact point namespaced keys, since namespaced keys were never used in legacy webchat.
    // TODO: This logic can be removed in October 2018, when all sessions from before September 2017 have expired
    localStorageKeys:
      rawQuiqObject.localStorageKeys ||
      (isStorageEnabled() ? getQuiqKeysFromLocalStorage(null, contactPoint) : {}),
    enforceAgentAvailability:
      rawQuiqObject.enforceAgentAvailability === undefined
        ? true
        : rawQuiqObject.enforceAgentAvailability,
    color: rawQuiqObject.color || primaryColor,
    colors: Object.assign(
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
      rawQuiqObject.colors,
    ),
    styles: rawQuiqObject.styles || {},
    position: rawQuiqObject.position || {},
    headerText: rawQuiqObject.headerText || messages.hereToHelp,
    host,
    clientDomain: rawQuiqObject.clientDomain || getWindowDomain(),
    href: window.location.href, // Standalone uses this to determine original host URL for welcome form
    debug: rawQuiqObject.debug || false,
    welcomeForm: rawQuiqObject.welcomeForm
      ? processWelcomeForm(rawQuiqObject.welcomeForm)
      : undefined,
    fontFamily: rawQuiqObject.fontFamily || 'sans-serif',
    width: rawQuiqObject.width || 400,
    height: rawQuiqObject.height || 600,
    autoPopTime: rawQuiqObject.autoPopTime,
    customLaunchButtons: rawQuiqObject.customLaunchButtons || [],
    mobileNumber: rawQuiqObject.mobileNumber,
    includeEmojis: rawQuiqObject.includeEmojis,
    excludeEmojis: rawQuiqObject.excludeEmojis,
    menuOptions: rawQuiqObject.menuOptions || {
      [MenuItemKeys.EMAIL_TRANSCRIPT]: true,
    },
    messages: Object.assign(
      {},
      {
        titleText: '',
        headerText: rawQuiqObject.headerText || messages.hereToHelp,
        sendButtonLabel: messages.send,
        messageFieldPlaceholder: messages.sendUsAMessage,
        welcomeFormValidationErrorMessage: messages.welcomeFormValidationError,
        welcomeFormSubmitButtonLabel: messages.submitWelcomeForm,
        welcomeFormSubmittingButtonLabel: messages.submittingWelcomeForm,
        agentTypingMessage: messages.agentIsTyping,
        agentEndedConversationMessage: messages.agentEndedConversation,
        agentsNotAvailableMessage: messages.agentsNotAvailable,
        connectingMessage: messages.connecting,
        reconnectingMessage: messages.reconnecting,
        errorMessage: messages.errorState,
        inactiveMessage: messages.clientInactive,
        requiredFieldAriaLabel: messages.required,
        minimizeWindowTooltip: messages.minimizeWindow,
        dockWindowTooltip: messages.dockWindow,
        openInNewWindowTooltip: messages.openInNewWindow,
        closeWindowTooltip: messages.closeWindow,
        emojiPickerTooltip: messages.emojiPickerTooltip,
        optionsMenuTooltip: messages.optionsMenuTooltip,
        emailTranscriptMenuMessage: messages.emailTranscriptMenuMessage,
        emailTranscriptMenuTooltip: messages.emailTranscriptMenuTooltip,
        emailTranscriptInputPlaceholder: messages.emailTranscriptInputPlaceholder,
        emailTranscriptInputCancelTooltip: messages.emailTranscriptInputCancelTooltip,
        emailTranscriptInputSubmitTooltip: messages.emailTranscriptInputSubmitTooltip,
        emailTranscriptInlineButton: messages.emailTranscriptInlineButton,
        messageArrivedNotification: messages.messageArrivedNotification,
      },
      rawQuiqObject.messages,
    ),
    // The following are internal, unsupported options used for E2E testing
    _internal: rawQuiqObject._internal || {},
  };

  return quiqOptions;
};

const processWelcomeForm = (form: WelcomeForm): WelcomeForm => {
  const newFormObject = Object.assign({}, form);
  if (form.fields) {
    newFormObject.fields.forEach(field => {
      // Ensure that id is defined. If not, use camel-cased version of label. (This is for backwards compatibility)
      // If label is not defined this is an error, and will be caught when welcomeForm is validated.
      /* eslint-disable no-param-reassign */
      if (!field.id && field.label) field.id = camelize(field.label);
      /* eslint-disable no-param-reassign */
    });
  }

  return newFormObject;
};

const processInternalOptions = (quiqOptions: QuiqObject) => {
  const {captureRequests, captureWebsockets} = quiqOptions._internal;

  // Setup request hook. This overrides the native fetch and xhr methods.
  // That's why we only do this when this option is specified.
  if (captureRequests) {
    window.__quiq__capturedRequests = [];
    const originalFetch = window.fetch;
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method: string, url: string) {
      window.__quiq__capturedRequests.push({method, url});
      return originalXhrOpen.call(this, method, url);
    };

    window.fetch = function(url: string, request: Object) {
      const method = request.method || 'GET';
      window.__quiq__capturedRequests.push({method, url});
      return originalFetch.call(this, url, request);
    };
  }

  if (captureWebsockets) {
    window.__quiq__ws = {
      instances: [],
      // $FlowIssue - Flow doesn't know how to handle get/set
      get connectedCount() {
        return this.instances.filter(ws => ws.readyState === 1).length;
      },
    };

    const originalWS = window.WebSocket;
    window.WebSocket = function(url: string, protocols: string) {
      const ws = new originalWS(url, protocols);
      window.__quiq__ws.instances.push(ws);
      return ws;
    };
  }
};

// $FlowIssue - It's possible for this to return undefined if localStorage is disabled. We are ok with this.
const getQuiqOptions = (): QuiqObject => {
  try {
    const quiqObject = JSON.parse(localStorage.getItem('quiqOptions') || '{}');

    // Set local storage items from quiqObject.localStorage Keys
    // This is used for backwards comparability, as well as for transferring session data from IFraqme to popup
    if (quiqObject.localStorageKeys) {
      setLocalStorageItemsIfNewer(quiqObject.localStorageKeys);
    }

    // Do any setup based on internal options, such as setting up hooks
    processInternalOptions(quiqObject);

    return quiqObject;
  } catch (e) {
    return {
      localStorageDisabled: true,
    };
  }
};

const quiqOptions: QuiqObject = getQuiqOptions();

export const validateWelcomeFormDefinition = (): void => {
  const form = quiqOptions.welcomeForm;
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
  const message = quiqOptions.messages[messageName];

  if (message === null || message === undefined)
    throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return getDisplayString(message);
};

export default quiqOptions;
