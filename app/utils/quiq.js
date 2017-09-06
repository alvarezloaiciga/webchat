// @flow
import messages from 'messages';
import {displayError, inStandaloneMode, camelize, setLocalStorageItems} from 'Common/Utils';
import {getDisplayString} from 'utils/i18n';
import type {QuiqObject, WelcomeForm} from 'Common/types';

const reservedKeyNames = ['Referrer'];

const processWelcomeForm = (form: WelcomeForm): WelcomeForm => {
  const newFormObject = Object.assign({}, form);
  if (form.fields) {
    newFormObject.fields.forEach(field => {
      // Ensure that id is defined. If not, use camel-cased version of label. (This is for backwards compatibility)
      // If label is not defined this is an error, and will be caught when welcomeForm is validated.
      if (!field.id && field.label) field.id = camelize(field.label);
    });
  }

  return newFormObject;
};

const getQuiqOptions = (): QuiqObject => {
  const rawQuiqObject = JSON.parse(localStorage.getItem('quiqOptions') || '{}');

  // Set local storage items from rawQuiqObject.localStorage Keys
  if (rawQuiqObject.localStorageKeys) {
    setLocalStorageItems(rawQuiqObject.localStorageKeys);
  }

  const primaryColor =
    (rawQuiqObject.colors && rawQuiqObject.colors.primary) || rawQuiqObject.color || '#59ad5d';
  const quiqOptions = {
    contactPoint: 'default',
    color: primaryColor,
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
    styles: {},
    position: {},
    headerText: messages.hereToHelp,
    host: undefined,
    clientDomain: undefined,
    debug: false,
    welcomeForm: rawQuiqObject.welcomeForm
      ? processWelcomeForm(rawQuiqObject.welcomeForm)
      : undefined,
    href: window.location.href, // Standalone uses this to determine original host URL for welcome form
    fontFamily: 'sans-serif',
    width: 400,
    height: 600,
    autoPopTime: undefined,
    customLaunchButtons: inStandaloneMode() ? [] : rawQuiqObject.customLaunchButtons || [],
    mobileNumber: undefined,
    messages: Object.assign(
      {},
      {
        headerText: rawQuiqObject.headerText || messages.hereToHelp,
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
      rawQuiqObject.messages,
    ),
  };

  const returnValue = Object.assign({}, quiqOptions, rawQuiqObject);
  localStorage.setItem('quiqOptions', JSON.stringify(returnValue));
  return returnValue;
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

  if (!message) throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return getDisplayString(message);
};

export default quiqOptions;
