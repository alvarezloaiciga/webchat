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
};

export const noAgentsAvailableClass = 'noAgentsAvailable';

export const mobileClass = 'mobile';

export const messageTypes = {
  HEADER_TEXT: 'HEADER_TEXT',
  SEND_BUTTON_LABEL: 'SEND_BUTTON_LABEL',
  MESSAGE_FIELD_PLACEHOLDER: 'MESSAGE_FIELD_PLACEHOLDER',
  WELCOME_FORM_VALIDATION_ERROR_MESSAGE: 'WELCOME_FORM_VALIDATION_ERROR_MESSAGE',
  WELCOME_FORM_SUBMIT_BUTTON_LABEL: 'WELCOME_FORM_SUBMIT_BUTTON_LABEL',
  WELCOME_FORM_SUBMITTING_BUTTON_LABEL: 'WELCOME_FORM_SUBMITTING_BUTTON_LABEL',
  CONNECTING_MESSAGE: 'CONNECTING_MESSAGE',
  RECONNECTING_MESSAGE: 'RECONNECTING_MESSAGE',
  AGENT_TYPING_MESSAGE: 'AGENT_TYPING_MESSAGE',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
  REQUIRED_FIELD_ARIA_LABEL: 'REQUIRED_FIELD_ARIA_LABEL',
  MINIMIZE_WINDOW_TOOLTIP: 'MINIMIZE_WINDOW_TOOLTIP',
  DOCK_WINDOW_TOOLTIP: 'DOCK_WINDOW_TOOLTIP',
  OPEN_IN_NEW_WINDOW_TOOLTIP: 'OPEN_IN_NEW_WINDOW_TOOLTIP',
  CLOSE_WINDOW_TOOLTIP: 'CLOSE_WINDOW_TOOLTIP',
};
