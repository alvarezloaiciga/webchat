import {defineMessages} from 'react-intl';

export default defineMessages({
  send: {
    id: 'send',
    description: 'Generic send message',
    defaultMessage: 'Send',
  },
  sendUsAMessage: {
    id: 'sendUsAMessage',
    description: 'Generic Send us a message',
    defaultMessage: 'Send us a message...',
  },
  reconnecting: {
    id: 'reconnecting',
    description: 'Reconnecting to websocket',
    defaultMessage: 'Reconnecting...',
  },
  connecting: {
    id: 'connecting',
    description: 'Connecting to websocket',
    defaultMessage: 'Connecting...',
  },
  errorState: {
    id: 'errorState',
    description: 'Generic Error Message',
    defaultMessage: "We're having trouble connecting. Try refreshing the page.",
  },
  agentIsTyping: {
    id: 'agentIsTyping',
    description: 'Message to display when the agent is typing',
    defaultMessage: 'Agent is typing',
  },
  required: {
    id: 'required',
    description: 'Required',
    defaultMessage: 'Required',
  },
  referrer: {
    id: 'referrer',
    description: 'Message to append to welcome form telling agent what web page the customer is on',
    defaultMessage: 'Referrer',
  },
  cannotFindScript: {
    id: 'cannotFindScript',
    description: "Error to display when we can't find the script that loaded webchat",
    defaultMessage: 'Cannot find script that loaded Webchat. Please contact your administrator.',
  },
  standaloneFatalError: {
    id: 'standaloneFatalError',
    description:
      'Error to display when we load the QUIQ object from query params in standalone mode',
    defaultMessage: 'Error loading standalone mode. Are the query params properly formatted?',
  },
  errorParsingStandaloneObject: {
    id: 'errorParsingStandaloneObject',
    description:
      "Error to display when we found the QUIQ query param but weren't able to parse it into a valid QUIQ object",
    defaultMessage: 'Error while trying to parse the standalone QUIQ query object',
  },
  cannotDetermineHost: {
    id: 'cannotDetermineHost',
    description:
      "Error to display when we can't determine the hostid from the script src attribute",
    defaultMessage: 'Cannot determine host from script url. Please contact your administrator',
  },
  quiqFatalError: {
    id: 'quiqFatalError',
    description: 'Message to show a quiq fatal error',
    defaultMessage: 'QUIQ FATAL ERROR',
  },
  hereToHelp: {
    id: 'hereToHelp',
    description: 'Welcome message to display at top of webchat',
    defaultMessage: "We're here to help if you have any questions!",
  },
  openInNewWindow: {
    id: 'openInNewWindow',
    description: 'Message to display on open in new window icon',
    defaultMessage: 'Open chat in new window',
  },
  welcomeFormUniqueIdentifier: {
    id: 'wecomeFormUniqueIdentifier',
    description:
      'Unique identifier to key off of as identifying a message as the welcome form customer submission.',
    defaultMessage: 'Quiq Welcome Form Customer Submission',
  },
  dockWindow: {
    id: 'dockWindow',
    description:
      'Message to display when user hovers over button in standalone mode to dock the standalone window back into the parent window',
    defaultMessage: 'Dock chat',
  },
  closeWindow: {
    id: 'closeWindow',
    description: 'Close Window button',
    defaultMessage: 'Close window',
  },
  minimizeWindow: {
    id: 'minimizeWindow',
    description: 'Minimize Window button',
    defaultMessage: 'Minimize window',
  },
  cookiesMustBeEnabledError: {
    id: 'cookiesMustBeEnabledError',
    description: 'Error message to display when end user does not have cookies enabled',
    defaultMessage: 'Cookies must be enabled to use Webchat',
  },
  invalidWelcomeFormArray: {
    id: 'invalidWelcomeFormArray',
    description:
      'Error message to display when WELCOME_FORM is not valid because fields must be of type array.',
    defaultMessage: 'Invalid WELCOME_FORM definition: "WELCOME_FORM.fields" must be an array',
  },
  invalidWelcomeFormUndefined: {
    id: 'invalidWelcomeFormUndefined',
    description:
      'Error message to display when WELCOME_FORM is not valid because a field is missing required property.',
    defaultMessage:
      'Invalid WELCOME_FORM definition: The form field with id of "{id}" and label of "{label}" must have id, label and type defined.',
  },
  invalidWelcomeFormDefinitionKeyLength: {
    id: 'invalidWelcomeFormDefinitionKeyLength',
    description:
      'Error message to display when WELCOME_FORM is not valid because a field has an id that is too long.',
    defaultMessage:
      'Invalid WELCOME_FORM definition: The form field with id of "{id}" must have an id of length less or equal to than 80 characters.',
  },
  invalidWelcomeFormDefinitionKeyUniqueness: {
    id: 'invalidWelcomeFormDefinitionKeyUniqueness',
    description:
      "Error message to display when WELCOME_FORM is not valid because not all fields have unique id's.",
    defaultMessage: 'Invalid WELCOME_FORM definition: All fields must have a unique id',
  },
  invalidWelcomeFormDefinitionKeyReserved: {
    id: 'invalidWelcomeFormDefinitionKeyReserved',
    description:
      'Error message to display when WELCOME_FORM is not valid because a field has an id that is reserved',
    defaultMessage:
      'Invalid WELCOME_FORM definition: Fields cannot have an id of "{id}" as this id is used internally.',
  },
  invalidWelcomeFormFieldCount: {
    id: 'invalidWelcomeFormFieldCount',
    description:
      'Error message to display when WELCOME_FORM is not valid because there are too many fields',
    defaultMessage: 'Invalid WELCOME_FORM definition: There can be at most 20 fields',
  },
  invalidWelcomeFormFieldType: {
    id: 'invalidWelcomeFormFieldType',
    description:
      'Error message to display when WELCOME_FORM is not valid because an unsupported field type was given',
    defaultMessage: 'Invalid WELCOME_FORM definition: "{type}" is not a supported field type.',
  },
  invalidWelcomeFormFieldRowsType: {
    id: 'invalidWelcomeFormFieldRowsType',
    description:
      'Error message to display when WELCOME_FORM is not valid because a non-numeric value was specified for a field\'s "rows" parameter',
    defaultMessage:
      'Invalid WELCOME_FORM definition: All fields\' "rows" parameters must be of type number',
  },
  submitWelcomeForm: {
    id: 'submitWelcomeForm',
    description: 'Text of submit button on welcome form',
    defaultMessage: 'Submit',
  },
  submittingWelcomeForm: {
    id: 'submittingWelcomeForm',
    description: 'Text of submit button on welcome form while form is being submitted',
    defaultMessage: 'Submitting',
  },
  welcomeFormValidationError: {
    id: 'welcomeFormValidationError',
    description: 'Error displayed when user has not filled in a required field',
    defaultMessage: 'Please complete all fields marked with an *',
  },
  unableToBindCustomLauncherError: {
    id: 'unableToBindCustomLauncherError',
    description: 'Error to display when CUSTOM_LAUNCH_BUTTONS is misconfigured',
    defaultMessage: 'Unable to bind custom webchat launch buttons',
  },
  unableToFindCustomLauncherError: {
    id: 'unableToFindCustomLauncherError',
    description:
      'Error to display once we successfully bind the webchat buttons, but they are now missing',
    defaultMessage: 'Unable to find already-bound custom webchat launch buttons',
  },
  cssHttpsError: {
    id: 'cssHttpsError',
    description: 'Error displayed when css file is not an https url',
    defaultMessage: 'The CUSTOM_CSS_URL must be an HTTPS url.',
  },
});
