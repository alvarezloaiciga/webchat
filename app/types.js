// @flow

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
  initializedState: ChatInitializedStateType,
  popped: boolean,
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
    | 'NEW_WEBCHAT_SESSION',
};

export type ChatInitializedStateType =
  | 'uninitialized'
  | 'loading'
  | 'initialized'
  | 'error'
  | 'disconnected'
  | 'burned';

export type CookieDef = {
  id: string,
  expiration?: number,
  path?: string,
};

type CustomStyles = {
  HeaderMenu?: Object,
  HeaderMenuIcons?: Object,
  HeaderBanner?: Object,
  ErrorBanner?: Object,
  ToggleChatButton?: Object,
  ToggleChatButtonIcon?: Object,
  CustomerMessageBubble?: Object,
  CustomerMessageText?: Object,
  CustomerAvatar?: Object,
  AgentMessageBubble?: Object,
  AgentMessageText?: Object,
  AgentAvatar?: Object,
  MessageForm?: Object,
  MessageFormInput?: Object,
  MessageFormSend?: Object,
  WelcomeFormBanner?: Object,
  WelcomeFormField?: Object,
  WelcomeFormFieldLabel?: Object,
  WelcomeFormFieldInput?: Object,
  WelcomeFormFieldTextarea?: Object,
  WelcomeFormSubmitButton?: Object,
};

export type QuiqObject = {
  CONTACT_POINT: string,
  HOST: string,
  COLOR: string, // Deprecated in favor of COLORS.primary
  COLORS: {
    primary: string,
    agentMessageText: string,
    agentMessageLinkText: string,
    agentMessageBackground: string,
    customerMessageText: string,
    customerMessageLinkText: string,
    customerMessageBackground: string,
    transcriptBackground: string,
  },
  STYLES: CustomStyles,
  POSITION: {
    top?: number | string,
    bottom?: number | string,
    left?: number | string,
    right?: number | string,
  },
  HEADER_TEXT: string,
  MESSAGES: {
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
  AUTO_POP_TIME?: number,
  DEBUG:
    | false
    | {
        transport?: string,
        CUSTOM_CSS_URL?: string,
      },
  WELCOME_FORM?: WelcomeForm,
  HREF: string,
  FONT_FAMILY: string,
  WIDTH: number,
  HEIGHT: number,
  CUSTOM_LAUNCH_BUTTONS: Array<string>,
  MOBILE_NUMBER?: string | number,
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

export type IntlMessage = {
  id: string,
  description: string,
  defaultMessage: string,
};

export type IntlObject = {
  formatMessage: (msg: IntlMessage, values?: Object) => string,
  formatDate: (date: number | moment$Moment) => string,
  formatTime: (timestamp: number, options?: Object) => string,
  formatRelative: (date: number) => string,
};

export type ApiError = {
  code?: number,
  message?: string,
  status?: number,
};

export type BrowserNames =
  | 'Amaya'
  | 'Android Browser'
  | 'Arora'
  | 'Avant'
  | 'Baidu'
  | 'Blazer'
  | 'Bolt'
  | 'Camino'
  | 'Chimera'
  | 'Chrome'
  | 'Chromium'
  | 'Comodo Dragon'
  | 'Conkeror'
  | 'Dillo'
  | 'Dolphin'
  | 'Doris'
  | 'Edge'
  | 'Epiphany'
  | 'Fennec'
  | 'Firebird'
  | 'Firefox'
  | 'Flock'
  | 'GoBrowser'
  | 'iCab'
  | 'ICE Browser'
  | 'IceApe'
  | 'IceCat'
  | 'IceDragon'
  | 'Iceweasel'
  | 'IE'
  | 'IE Mobile'
  | 'Iron'
  | 'Jasmine'
  | 'K-Meleon'
  | 'Konqueror'
  | 'Kindle'
  | 'Links'
  | 'Lunascape'
  | 'Lynx'
  | 'Maemo'
  | 'Maxthon'
  | 'Midori'
  | 'Minimo'
  | 'MIUI Browser'
  | 'Safari'
  | 'Safari Mobile'
  | 'Mosaic'
  | 'Mozilla'
  | 'Netfront'
  | 'Netscape'
  | 'NetSurf'
  | 'Nokia'
  | 'OmniWeb'
  | 'Opera'
  | 'Opera Mini'
  | 'Opera Mobi'
  | 'Opera Tablet'
  | 'PhantomJS'
  | 'Phoenix'
  | 'Polaris'
  | 'QQBrowser'
  | 'RockMelt'
  | 'Silk'
  | 'Skyfire'
  | 'SeaMonkey'
  | 'SlimBrowser'
  | 'Swiftfox'
  | 'Tizen'
  | 'UCBrowser'
  | 'Vivaldi'
  | 'w3m'
  | 'WeChat'
  | 'Yandex'
  | null;
export type OSNames =
  | 'AIX'
  | 'Amiga OS'
  | 'Android'
  | 'Arch'
  | 'Bada'
  | 'BeOS'
  | 'BlackBerry'
  | 'CentOS'
  | 'Chromium OS'
  | 'Contiki'
  | 'Fedora'
  | 'Firefox OS'
  | 'FreeBSD'
  | 'Debian'
  | 'DragonFly'
  | 'Gentoo'
  | 'GNU'
  | 'Haiku'
  | 'Hurd'
  | 'iOS'
  | 'Joli'
  | 'Linpus'
  | 'Linux'
  | 'Mac OS'
  | 'Mageia'
  | 'Mandriva'
  | 'MeeGo'
  | 'Minix'
  | 'Mint'
  | 'Morph OS'
  | 'NetBSD'
  | 'Nintendo'
  | 'OpenBSD'
  | 'OpenVMS'
  | 'OS/2'
  | 'Palm'
  | 'PCLinuxOS'
  | 'Plan9'
  | 'Playstation'
  | 'QNX'
  | 'RedHat'
  | 'RIM Tablet OS'
  | 'RISC OS'
  | 'Sailfish'
  | 'Series40'
  | 'Slackware'
  | 'Solaris'
  | 'SUSE'
  | 'Symbian'
  | 'Tizen'
  | 'Ubuntu'
  | 'UNIX'
  | 'VectorLinux'
  | 'WebOS'
  | 'Windows'
  | 'Windows Phone'
  | 'Windows Mobile'
  | 'Zenwalk'
  | null;
export type DeviceTypes =
  | 'console'
  | 'mobile'
  | 'tablet'
  | 'smarttv'
  | 'wearable'
  | 'embedded'
  | null;
