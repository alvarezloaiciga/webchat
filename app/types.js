// @flow

export type ReduxStore = {dispatch: Dispatch, getState: GetState, subscribe: ReduxSubscribe};

export type WelcomeFormField = {
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea',
  label: string,
  id: string,
  required?: boolean,
  rows?: number,
  isInitialMessage?: boolean,
};

export type WelcomeForm = {
  headerText: string,
  fields: Array<WelcomeFormField>,
};

export type ChatState = {
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  agentsAvailable: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,
  agentTyping: boolean,
  welcomeFormRegistered: boolean,
};

export type Action = {
  type:
    | 'CHAT_CONTAINER_HIDDEN'
    | 'CHAT_LAUNCHER_HIDDEN'
    | 'CHAT_INITIALIZED_STATE'
    | 'CHAT_POPPED'
    | 'UPDATE_TRANSCRIPT'
    | 'AGENT_TYPING'
    | 'WELCOME_FORM_REGISTERED'
    | 'NEW_WEBCHAT_SESSION'
    | 'AGENTS_AVAILABLE'
};

export type ChatInitializedStateType =
  | 'uninitialized'
  | 'loading'
  | 'initialized'
  | 'error'
  | 'disconnected'
  | 'inactive'
  | 'burned';

export type CookieDef = {
  id: string,
  expiration?: number,
  path?: string,
};

export type QuiqObject = {
  contactPoint: string,
  host: string,
  clientDomain: string,
  color: string, // Deprecated in favor of COLORS.primary
  colors: {
    primary: string,
    agentMessageText: string,
    agentMessageLinkText: string,
    agentMessageBackground: string,
    customerMessageText: string,
    customerMessageLinkText: string,
    customerMessageBackground: string,
    transcriptBackground: string,
  },
  styles: CustomStyles,
  position: {
    top?: number | string,
    bottom?: number | string,
    left?: number | string,
    right?: number | string,
  },
  headerText: string,
  messages: {
    headerText: string,
    sendButtonLabel: string,
    messageFieldPlaceholder: string,
    welcomeFormValidationErrorMessage: string,
    welcomeFormSubmitButtonLabel: string,
    welcomeFormSubmittingButtonLabel: string,
    agentTypingMessage: string,
    connectingMessage: string,
    reconnectingMessage: string,
    errorMessage: string,
    requiredFieldAriaLabel: string,
    minimizeWindowTooltip: string,
    dockWindowTooltip: string,
    openInNewWindowTooltip: string,
    closeWindowTooltip: string,
  },
  autoPopTime?: number,
  debug:
    | false
    | {
        transport?: string,
        customCssUrl?: string,
      },
  welcomeForm?: WelcomeForm,
  href: string,
  fontFamily: string,
  width: number,
  height: number,
  customLaunchButtons: Array<string>,
  mobileNumber?: string | number,
};

export type EventType = 'Join' | 'Leave' | 'Register' | 'AgentTyping';
export type AuthorType = 'Customer' | 'Agent';
export type MessageType = 'Text' | 'ChatMessage';

export type Message = {
  authorType: AuthorType,
  text: string,
  id: string,
  timestamp: number,
  type: 'Text',
};

export type Event = {
  id: string,
  timestamp: number,
  type: EventType,
  typing?: boolean,
};

export type Conversation = {
  id: string,
  messages: Array<Message>,
};

export type AtmosphereTransportType =
  | 'websocket'
  | 'long-polling'
  | 'jsonp'
  | 'sse'
  | 'streaming'
  | 'polling';

export type AtmosphereRequest = {
  url: string,
  contentType: string,
  logLevel: string,
  transport: AtmosphereTransportType,
  fallbackTransport: AtmosphereTransportType,
  trackMessageLength: boolean,
  maxReconnectOnClose: number,
  reconnectInterval: number,
  uuid?: string,
  onOpen?: (response: AtmosphereResponse) => void,
  onReopen?: () => void,
  onReconnect?: (req: AtmosphereRequest, res: AtmosphereResponse) => void,
  onTransportFailure?: (errorMsg: string, request: AtmosphereRequest) => void,
  onMessage?: (response: AtmosphereResponse) => void,
  onError?: (response: AtmosphereResponse) => void,
  onClientTimeout?: (req: AtmosphereRequest) => void,
  onClose?: (response: AtmosphereResponse) => void,
};

export type AtmosphereResponse = {
  request: AtmosphereRequest,
  responseBody: Object,
  status: number,
  error?: string,
  state: string,
};

export type AtmosphereConnectionBuilder = {
  socketUrl: string,
  options: {
    onConnectionLoss: () => void,
    onConnectionEstablish: () => void,
    handleMessage: (message: AtmosphereMessage) => void,
  },
};

export type AtmosphereConnection = {
  pingTimeout?: number,
  upgradeTimeout?: number,
  pendingPing?: boolean,
  originalTransport: AtmosphereTransportType,
  originalFallbackTransport: AtmosphereTransportType,
  request: {
    url: string,
    contentType: string,
    logLevel: string,
    transport: AtmosphereTransportType,
    fallbackTransport: AtmosphereTransportType,
    trackMessageLength: boolean,
    maxReconnectOnClose: number,
    reconnectInterval: number,
    uuid?: string,
    onOpen: (response: AtmosphereResponse) => void,
    onClose: (response: AtmosphereResponse) => void,
    onReopen: () => void,
    onReconnect: (req: AtmosphereRequest, res: AtmosphereResponse) => void,
    onMessage: (response: AtmosphereResponse) => void,
    onTransportFailure: (errorMsg: string, req: AtmosphereRequest) => void,
    onError: (response: AtmosphereResponse) => void,
    onClientTimeout: (req: AtmosphereRequest) => void,
  },
};

export type AtmosphereMessage = {
  data: Object,
  messageType: MessageType,
  tenantId: string,
};

export type ApiError = {
  code?: number,
  message?: string,
  status?: number,
};
