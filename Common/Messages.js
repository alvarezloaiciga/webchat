import {defineMessages} from 'react-intl';

export default defineMessages({
  messageArrivedNotification: {
    id: 'messageArrivedNotification',
    description: 'Message Arrived',
    defaultMessage: 'New Message from Quiq Webchat',
  },
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
  clientInactive: {
    id: 'clientInactive',
    description: 'Generic Client Inactive Message',
    defaultMessage:
      'You have been disconnected due to inactivity. Please refresh the page to reconnect.',
  },
  agentIsTyping: {
    id: 'agentIsTyping',
    description: 'Message to display when the agent is typing',
    defaultMessage: 'Agent is typing',
  },
  agentEndedConversation: {
    id: 'agentEndedConversation',
    description: 'Message to display when the agent ends conversation',
    defaultMessage: 'Agent has ended the conversation.',
  },
  agentsNotAvailable: {
    id: 'agentsNotAvailable',
    description: 'Message to display when no agents are avialable.',
    defaultMessage: 'No agents are currently available.',
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
      'Error to display when we load the quiqOptions object from query params in standalone mode',
    defaultMessage: 'Error loading standalone mode. Are the query params properly formatted?',
  },
  errorParsingStandaloneObject: {
    id: 'errorParsingStandaloneObject',
    description:
      "Error to display when we found the quiqOptions query param but weren't able to parse it into a valid quiqOptions object",
    defaultMessage: 'Error while trying to parse the standalone quiqOptions query object',
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
    defaultMessage: 'quiqOptions FATAL ERROR',
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
  emojiPickerTooltip: {
    id: 'emojiPickerTooltip',
    description: 'Tooltip for emoji picker toggle button',
    defaultMessage: 'Emoji picker',
  },
  optionsMenuTooltip: {
    id: 'optionsMenuTooltip',
    description: 'Tooltip for the options button to the left of the MessageForm',
    defaultMessage: 'Options',
  },
  emailTranscriptMenuMessage: {
    id: 'emailTranscriptMenuMessage',
    description:
      'Message to display in the options menu for the user to get an email containing the transcript of the chat',
    defaultMessage: 'Email Transcript',
  },
  emailTranscriptMenuTooltip: {
    id: 'emailTranscriptMenuTooltip',
    description: 'Tooltip for Email transcript menu button',
    defaultMessage: 'Email a full transcript of the current chat',
  },
  emailTranscriptInputPlaceholder: {
    id: 'emailTranscriptInputPlaceholder',
    description:
      'Message to display to user when they need to enter an Email to receive their transcript',
    defaultMessage: 'Enter your Email...',
  },
  emailTranscriptInputCancelTooltip: {
    id: 'emailTranscriptInputCancelTooltip',
    description: 'Tooltip to display above the Cancel button on the email transcript input',
    defaultMessage: 'Cancel Email Transcript',
  },
  emailTranscriptInputSubmitTooltip: {
    id: 'emailTranscriptInputSubmitTooltip',
    description: 'Tooltip to display above the Submit button on the email transcript input',
    defaultMessage: 'Email Transcript',
  },
  emailTranscriptInlineButton: {
    id: 'emailTranscriptInlineButton',
    description:
      'Text to display on the Email Transcript button that shows inline when agent ends convo',
    defaultMessage: 'Email Transcript',
  },
  transcriptEmailedEventMessage: {
    id: 'transcriptEmailedEventMessage',
    description:
      'Text to display on the inline Event displayed to the user when a transcript was successfully e-mailed to them',
    defaultMessage: 'Transcript Emailed',
  },
  attachmentBtnTooltip: {
    id: 'attachmentBtnTooltip',
    description: 'Tooltip for attachment button',
    defaultMessage: 'Send file',
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
  mfInitNeeded: {
    id: 'mfInitNeeded',
    description:
      "Error displayed when init() has not been run in malfunction junction and we try and run something we shouldn't",
    defaultMessage:
      'MalfunctionJunction.init() must be run before posting a message, setting up listeners, or setting up Redux observers.',
  },
  cannotFindHostingWindow: {
    id: 'cannotFindHostingWindow',
    description: "Error for when webchat can't find the host window (where SDK is running)",
    defaultMessage: 'Unable to find host window',
  },
  invalidAttachmentMessage: {
    id: 'invalidAttachmentMessage',
    description: 'Alert message for invalid attachment upload',
    defaultMessage:
      "We couldn't send your attachment. Only image files are supported, and must be smaller than 50 MB",
  },
  muteSounds: {
    id: 'muteSounds',
    description: 'label for muting sounds',
    defaultMessage: 'Mute Sounds',
  },
  unmuteSounds: {
    id: 'unmuteSounds',
    description: 'label for unmuting sounds',
    defaultMessage: 'Unmute Sounds',
  },
  muteSoundsTooltip: {
    id: 'muteSoundsTooltip',
    description: 'tooltip for muting sounds',
    defaultMessage: 'Mute new message sounds',
  },
  unmuteSoundsTooltip: {
    id: 'unmuteSoundsTooltip',
    description: 'tooltip for unmuting sounds',
    defaultMessage: 'Unmute new message sounds',
  },
});
