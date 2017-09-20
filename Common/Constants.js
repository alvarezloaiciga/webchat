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

export const quiqChatFrameId = 'quiqChatFrame';

// Default launch button classes and id's
export const noAgentsAvailableClass = 'noAgentsAvailable';
export const chatClosedClass = 'ChatClosed';
export const chatOpenClass = 'ChatOpen';
export const launchButtonId = 'quiqChatDefaultLaunchButton';
export const launchButtonIconOpenId = 'quiqToggleChatIconOpen';
export const launchButtonIconCloseId = 'quiqToggleChatIconClose';
export const mobileClass = 'mobile';

export const webchatPath = 'app/webchat/webchat.html';
export const bridgePath = 'app/webchat/bridge.html';

export const StandaloneWindowName = 'quiq-standalone-webchat';

export const eventTypes: {[string]: string} = {
  chatVisibilityDidChange: 'QUIQ_CHAT_VISIBILITY_DID_CHANGE',
  agentAvailabilityDidChange: 'QUIQ_AGENT_AVAILABILITY_DID_CHANGE',
  _standaloneOpen: 'QUIQ_STANDALONE_OPEN',
  _launchButtonVisibilityShouldChange: 'QUIQ_LAUNCH_BUTTON_VISIBILITY_SHOULD_CHANGE'
};

// Any eventType that does not begin with "_" is exposed on the Quiq object handed to the client.
export const publicEventTypes = Object.keys(eventTypes)
  .reduce((acc, k) => Object.assign({}, acc, k.startsWith('_') ? {} : {[k]: eventTypes[k]}), {});

export const actionTypes = {
  setChatVisibility: 'QUIQ_SET_CHAT_VISIBILITY',
  getChatVisibility: 'QUIQ_GET_CHAT_VISIBILITY',
  getAgentAvailability: 'QUIQ_GET_AGENT_AVAILABILITY',
  sendRegistration: 'QUIQ_SEND_REGISTRATION',
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
  headerText: 'headerText',
  sendButtonLabel: 'sendButtonLabel',
  messageFieldPlaceholder: 'messageFieldPlaceholder',
  welcomeFormValidationErrorMessage: 'welcomeFormValidationErrorMessage',
  welcomeFormSubmitButtonLabel: 'welcomeFormSubmitButtonLabel',
  welcomeFormSubmittingButtonLabel: 'welcomeFormSubmittingButtonLabel',
  connectingMessage: 'connectingMessage',
  reconnectingMessage: 'reconnectingMessage',
  agentTypingMessage: 'agentTypingMessage',
  agentEndedConversationMessage: 'agentEndedConversationMessage',
  errorMessage: 'errorMessage',
  inactiveMessage: 'inactiveMessage',
  requiredFieldAriaLabel: 'requiredFieldAriaLabel',
  minimizeWindowTooltip: 'minimizeWindowTooltip',
  dockWindowTooltip: 'dockWindowTooltip',
  openInNewWindowTooltip: 'openInNewWindowTooltip',
  closeWindowTooltip: 'closeWindowTooltip',
};

export const localStorageKeys = [
  'X-Quiq-Access-Token',
  'quiq-chat-container-visible',
  'quiq-tracking-id',
  'quiq-user-taken-meaningful-action',
  '__storejs_expire_mixin_X-Quiq-Access-Token',
  '__storejs_expire_mixin_quiq-chat-container-visible',
  '__storejs_expire_mixin_quiq-tracking-id',
  '__storejs_expire_mixin_quiq-user-taken-meaningful-action',
  '__storejs_modified_timestamp_mixin_X-Quiq-Access-Token',
  '__storejs_modified_timestamp_mixin_quiq-chat-container-visible',
  '__storejs_modified_timestamp_mixin_quiq-tracking-id',
  '__storejs_modified_timestamp_mixin_quiq-user-taken-meaningful-action',
];
