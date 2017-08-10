export const MessageTypes = {
  TEXT: 'Text',
  CHAT_MESSAGE: 'ChatMessage',
};

export const EventTypes = {
  JOIN: 'Join',
  LEAVE: 'Leave',
  REGISTER: 'Register',
  AGENT_TYPING: 'AgentTyping',
};

export const StandaloneWindowName = 'quiq-standalone-webchat';

export const SupportedWebchatUrls = [
  'goquiq.com/app/webchat',
  'quiq.sh/app/webchat',
  'centricient.com/app/webchat',
  'centricient.corp/app/webchat',
  'quiq.dev:7000/app/webchat',
  'centricient.dev:7000/app/webchat',
  'quiq.dev:41014/app/webchat',
  'centricient.dev:41014/app/webchat',
];

export const ChatInitializedState = {
  UNINITIALIZED: 'uninitialized',
  LOADING: 'loading',
  INITIALIZED: 'initialized',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
  INACTIVE: 'inactive',
  BURNED: 'burned',
};

export const noAgentsAvailableClass = 'noAgentsAvailable';

export const mobileClass = 'mobile';

export const messageTypes = {
  headerText: 'headerText',
  sendButtonLabel: 'sendButtonLabel',
  messageFieldPlaceholder: 'messageFieldPlaceholder',
  welcomeFormValidationErrorMessage: 'welcomeFormValidationErrorMessage',
  welcomeFormSubmitButtonLabel: 'welcomeFormSubmitButtonLabel',
  welcomeFormSubmittingButtonLabel: 'welcomeFormSubmittingButtonLabel',
  connectingMessage: 'connectingMessage',
  reconnectingMessage: 'reconnectingMessage',
  agentTypingMessage: 'agentTypingMessage',
  errorMessage: 'errorMessage',
  inactiveMessage: 'inactiveMessage',
  requiredFieldAriaLabel: 'requiredFieldAriaLabel',
  minimizeWindowTooltip: 'minimizeWindowTooltip',
  dockWindowTooltip: 'dockWindowTooltip',
  openInNewWindowTooltip: 'openInNewWindowTooltip',
  closeWindowTooltip: 'closeWindowTooltip',
};

export const eventTypes = {
  chatVisibilityDidChange: 'QUIQ_CHAT_VISIBILITY_DID_CHANGE',
};

export const actionTypes = {
  setChatVisibility: 'QUIQ_SET_CHAT_VISIBILITY',
  getChatVisibility: 'QUIQ_GET_CHAT_VISIBILITY',
};
