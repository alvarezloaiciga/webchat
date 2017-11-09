export const SupportedWebchatUrls = [
  'goquiq.com/app/webchat',
  'quiq.sh/app/webchat',
  'centricient.com/app/webchat',
  'centricient.corp/app/webchat',
  'quiq.dev:7000/app/webchat',
  'quiq.dev:3000/app/webchat',
  'centricient.dev:7000/app/webchat',
  'quiq.dev:41014/app/webchat',
  'centricient.dev:41014/app/webchat',
];

export const unknownErrorMessage = 'An unknown error occurred.';

// Default launch button classes and id's
export const noAgentsAvailableClass = 'noAgentsAvailable';
export const mobileClass = 'mobile';
export const unsupportedBrowserClass = 'unsupportedBrowser';
export const storageDisabledClass = 'storageDisabled';
export const hasMobileNumberClass = 'hasMobileNumber';

export const chatClosedClass = 'ChatClosed';
export const chatOpenClass = 'ChatOpen';
export const quiqContainerId = 'quiqWebChat';

export const webchatPath = 'app/webchat/webchat.html';
export const bridgePath = 'app/webchat/bridge.html';

export const StandaloneWindowName = 'quiq-standalone-webchat';

export const eventTypes: {[string]: string} = {
  messageArrived: 'QUIQ_MESSAGE_ARRIVED',
  chatVisibilityDidChange: 'QUIQ_CHAT_VISIBILITY_DID_CHANGE',
  _standaloneOpen: 'QUIQ_STANDALONE_OPEN',
  _launchButtonVisibilityShouldChange: 'QUIQ_LAUNCH_BUTTON_VISIBILITY_SHOULD_CHANGE',
};

// Any eventType that does not begin with "_" is exposed on the Quiq object handed to the client.
export const publicEventTypes = Object.keys(eventTypes).reduce(
  (acc, k) => Object.assign({}, acc, k.startsWith('_') ? {} : {[k]: eventTypes[k]}),
  {},
);

export const actionTypes = {
  loadChat: 'QUIQ_LOAD_CHAT',
  getChatStatus: 'QUIQ_GET_CHAT_STATUS',
  setChatVisibility: 'QUIQ_SET_CHAT_VISIBILITY',
  getChatVisibility: 'QUIQ_GET_CHAT_VISIBILITY',
  getAgentAvailability: 'QUIQ_GET_AGENT_AVAILABILITY',
  getHandle: 'QUIQ_GET_HANDLE',
  sendRegistration: 'QUIQ_SEND_REGISTRATION',
  uploadProgress: 'UPLOAD_PROGRESS',
  addPendingMessage: 'ADD_PENDING_MESSAGE',
  updatePendingMessageId: 'UPDATE_PENDING_MESSAGE_ID',
  updatePlatformEvents: 'UPDATE_PLATFORM_EVENTS',
  configurationLoaded: 'CHAT_CONFIGURATION_LOADED',
  getCanFlashNotifications: 'QUIQ_GET_CAN_FLASH_NOTIFICATIONS',
  removeMessage: 'REMOVE_MESSAGE',
};

export const MessageTypes = {
  TEXT: 'Text',
  CHAT_MESSAGE: 'ChatMessage',
};

export const EventTypes = {
  JOIN: 'Join',
  LEAVE: 'Leave',
  REGISTER: 'Register',
  AGENT_TYPING: 'AgentTyping',
  AGENT_ENDED_CONVERSATION: 'AgentEndedConversation',
  END: 'End',
  SPAM: 'Spam',
};

export const ChatInitializedState = {
  UNINITIALIZED: 'uninitialized',
  LOADING: 'loading',
  INITIALIZED: 'initialized',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
  INACTIVE: 'inactive',
  BURNED: 'burned',
  SLEEPING: 'sleeping',
};

export const messageTypes = {
  pageTitle: 'pageTitle',
  titleText: 'titleText',
  headerText: 'headerText',
  sendButtonLabel: 'sendButtonLabel',
  messageFieldPlaceholder: 'messageFieldPlaceholder',
  welcomeFormValidationErrorMessage: 'welcomeFormValidationErrorMessage',
  welcomeFormSubmitButtonLabel: 'welcomeFormSubmitButtonLabel',
  welcomeFormSubmittingButtonLabel: 'welcomeFormSubmittingButtonLabel',
  connectingMessage: 'connectingMessage',
  reconnectingMessage: 'reconnectingMessage',
  agentTypingMessage: 'agentTypingMessage',
  agentsNotAvailableMessage: 'agentsNotAvailableMessage',
  agentEndedConversationMessage: 'agentEndedConversationMessage',
  errorMessage: 'errorMessage',
  inactiveMessage: 'inactiveMessage',
  requiredFieldAriaLabel: 'requiredFieldAriaLabel',
  minimizeWindowTooltip: 'minimizeWindowTooltip',
  dockWindowTooltip: 'dockWindowTooltip',
  openInNewWindowTooltip: 'openInNewWindowTooltip',
  optionsMenuTooltip: 'optionsMenuTooltip',
  emailTranscriptMenuMessage: 'emailTranscriptMenuMessage',
  emailTranscriptMenuTooltip: 'emailTranscriptMenuTooltip',
  emailTranscriptInputPlaceholder: 'emailTranscriptInputPlaceholder',
  emailTranscriptInputCancelTooltip: 'emailTranscriptInputCancelTooltip',
  emailTranscriptInputSubmitTooltip: 'emailTranscriptInputSubmitTooltip',
  emailTranscriptInlineButton: 'emailTranscriptInlineButton',
  messageArrivedNotification: 'messageArrivedNotification',
  closeWindowTooltip: 'closeWindowTooltip',
  emojiPickerTooltip: 'emojiPickerTooltip',
  attachmentBtnTooltip: 'attachmentBtnTooltip',
  invalidAttachmentMessage: 'invalidAttachmentMessage',
  attachmentUploadError: 'attachmentUploadError',
  muteSounds: 'muteSounds',
  unmuteSounds: 'unmuteSounds',
  muteSoundsTooltip: 'muteSoundsTooltip',
  unmuteSoundsTooltip: 'unmuteSoundsTooltip',
  transcriptEmailedEventMessage: 'transcriptEmailedEventMessage',
};

export const localStorageKeys = [
  'X-Quiq-Access-Token',
  'quiq-chat-container-visible',
  'quiq-tracking-id',
  'quiq-user-taken-meaningful-action',
  'quiq-user-subscribed',
  'quiq_mute_sounds',
];

export const MenuItemKeys = {
  EMAIL_TRANSCRIPT: 'emailTranscript',
  MUTE_SOUNDS: 'muteSounds',
};

export const UserEmailKey = 'quiq-client-data';

export const maxAttachmentSize = 50 * 1000000;

export const modes = {
  DOCKED: 'docked',
  UNDOCKED: 'undocked',
  EITHER: 'either',
};
