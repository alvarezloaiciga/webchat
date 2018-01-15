// @flow

import type {PersistentData} from 'quiq-chat/src/types';

export type ReduxStore = {dispatch: any => any, getState: () => ChatState};

export type QuiqObject = {
  /**
   * Documented Properties. If you modify this,
   * be sure to update the README
   */
  displayMode: 'docked' | 'undocked' | 'either',
  agentsAvailableTimer: number,
  anchorElement: string,
  autoPopTime?: number,
  colors: {
    // Deprecated in favor styles object
    primary: string,
    eventText: string,
    menuText: string,
    agentMessageText: string,
    agentMessageLinkText: string,
    agentMessageBackground: string,
    customerMessageText: string,
    customerMessageLinkText: string,
    customerMessageBackground: string,
    attachmentMessageColor: string,
    transcriptBackground: string,
    typingIndicatorForeground: string,
    typingIndicatorBackground: string,
    browserTheme: string | null,
  },
  events: {
    showTime: boolean,
  },
  contactPoint: string,
  customLaunchButtons: Array<string>,
  showDefaultLaunchButton: boolean,
  customScreens: {
    waitScreen?: {
      url: string,
      height?: number,
      minHeight?: number,
    },
  },
  icons: {
    favicon?: string,
    appleTouchIcon?: string,
  },
  demoMode: boolean,
  enforceAgentAvailability: boolean,
  excludeEmojis?: Array<string>,
  fontFamily: string,
  height: number,
  host: string,
  includeEmojis?: Array<string>,
  messages: {
    pageTitle: string,
    titleText: string,
    headerText: string,
    messageFieldPlaceholder: string,
    welcomeFormValidationErrorMessage: string,
    welcomeFormSubmitButtonLabel: string,
    welcomeFormSubmittingButtonLabel: string,
    agentTypingMessage: string,
    agentEndedConversationMessage: string,
    agentsNotAvailableMessage: string,
    connectingMessage: string,
    reconnectingMessage: string,
    errorMessage: string,
    requiredFieldAriaLabel: string,
    minimizeWindowTooltip: string,
    dockWindowTooltip: string,
    openInNewWindowTooltip: string,
    closeWindowTooltip: string,
    unsupportedBrowser?: string,
    storageDisabled?: string,
    emojiPickerTooltip: string,
    attachmentBtnTooltip: string,
    optionsMenuTooltip: string,
    sendButtonLabel: string,
    emailTranscriptInlineButton: string,
    emailTranscriptMenuMessage: string,
    emailTranscriptMenuTooltip: string,
    emailTranscriptInputPlaceholder: string,
    emailTranscriptInputCancelTooltip: string,
    emailTranscriptInputSubmitTooltip: string,
    transcriptEmailedEventMessage: string,
    messageArrivedNotification: string,
    unsupportedFileType: string,
    attachmentTooLarge: string,
    attachmentUploadError: string,
    muteSounds: string,
    unmuteSounds: string,
    muteSoundsTooltip: string,
    unmuteSoundsTooltip: string,
    cannotStartNewConversationMessage: string,
    emojiPicker: {
      search: string,
      notfound: string, // Intentionally not camelCased for compatibility with emoji-mart
      categories: {
        search: string,
        recent: string,
        people: string,
        nature: string,
        foods: string,
        activity: string,
        places: string,
        objects: string,
        symbols: string,
        flags: string,
        custom: string,
      },
    },
  },
  mobileNumber?: string | number,
  position: {
    top?: number | string,
    bottom?: number | string,
    left?: number | string,
    right?: number | string,
  },
  styles: CustomStyles,
  welcomeForm?: WelcomeForm,
  width: number,
  /**
   * Undocument Properties
   */
  clientDomain: string,
  color: string, // Deprecated in favor styles object
  debug:
    | false
    | {
        transport?: string,
        CUSTOM_CSS_URL?: string,
      },
  headerText: string, // Deprecated in favor of messages object
  href: string,
  localStorageKeys: {[string]: any},
  _internal: {
    captureRequests?: boolean,
    captureWebsockets?: boolean,
    exposeDraftJsFunctions?: boolean,
  },
};

export type ChatterboxConfiguration = {
  enableChatEmailTranscript: boolean,
  enableChatFileAttachments: boolean,
  enableManualConvoStart: boolean,
  enableMobileChat: boolean,
  supportedAttachmentTypes: Array<string>,
  enableEmojis: boolean,
  playSoundOnNewMessage: boolean,
  flashNotificationOnNewMessage: boolean,
  registrationForm?: WelcomeForm | null,
  menuOptions: {
    customItems: Array<CustomMenuItem>,
    offset?: {
      horizontal?: string,
      vertical?: string,
    } | null,
  },
  whitelistedDomains: string,
};

export type ChatConfiguration = {
  /* eslint-disable no-undef */
  ...$Exact<ChatterboxConfiguration>,
  ...$Exact<QuiqObject>,
  /* eslint-enable no-undef */
};

export type BooleanConfig = {
  enabled: boolean,
};

export type ArrayConfig = Array<string>;

export type ChatMetadata = {
  configs: {
    [string]: BooleanConfig | ArrayConfig,
  },
  registrationForm?: {
    headerText: string,
    fields: Array<WelcomeFormField>,
  },
};

export type WelcomeFormField = {
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select',
  label: string,
  id: string,
  required?: boolean,
  rows?: number,
  isInitialMessage?: boolean,
  options?: string,
  additionalProperties: {
    options?: string,
    rows?: number,
    isInitialMessage?: boolean,
  },
};

export type RegistrationField = {
  id: string,
  value: string,
};

export type WelcomeForm = {
  headerText: string,
  fields: Array<WelcomeFormField>,
};

type CustomStyles = {
  HeaderMenu?: Object,
  TitleText?: Object,
  HeaderMenuIcons?: Object,
  HeaderBanner?: Object,
  ErrorBanner?: Object,
  ToggleChatButton?: Object,
  ToggleChatButtonIcon?: Object,
  CustomerMessageBubble?: Object,
  CustomerAttachmentBubble?: Object,
  CustomerAttachmentText?: Object,
  CustomerMessageText?: Object,
  CustomerAvatar?: Object,
  AgentMessageBubble?: Object,
  AgentAttachmentBubble?: Object,
  AgentAttachmentText?: Object,
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
  WelcomeFormFieldSelect?: Object,
  WelcomeFormFieldOption?: Object,
  WelcomeFormSubmitButton?: Object,
  OptionsMenuButton?: Object,
  OptionsMenuButtonIcon?: Object,
  OptionsMenuContainer?: Object,
  OptionsMenuLineItem?: Object,
  OptionsMenuLineItemIcon?: Object,
  ContentButtons?: Object,
  EmailTranscriptInputContainer?: Object,
  EmailTranscriptInput?: Object,
  EmailTranscriptInputCancelButton?: Object,
  EmailTranscriptInputSubmitButton?: Object,
  EventContainer?: Object,
  EventText?: Object,
  EventLine?: Object,
  InlineActionButton?: Object,
  NonChat?: Object,
  TypingIndicatorSvgStyle?: Object,
  TypingIndicatorCircleStyle?: Object,
};

export type EmailTranscriptPayload = {
  email: string,
  originUrl: string,
  timezone?: string,
};

export type IntlMessage = {
  id: string,
  description: string,
  defaultMessage: string,
};

export type IntlObject = {
  formatMessage: (msg: IntlMessage, values: ?{[key: string]: string}) => string,
  formatDate: (date: number | moment$Moment) => string,
  formatTime: (time: number | moment$Moment, options: ?Object) => string,
  formatRelative: (date: number) => string,
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
  | 'Yandex';
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
export type BrowserEngine =
  | 'Amaya'
  | 'EdgeHTML'
  | 'Gecko'
  | 'iCab'
  | 'KHTML'
  | 'Links'
  | 'Lynx'
  | 'NetFront'
  | 'NetSurf'
  | 'Presto'
  | 'Tasman'
  | 'Trident'
  | 'w3m'
  | 'WebKit';

export type ChatState = {
  chatContainerHidden: boolean,
  chatLauncherHidden: boolean,
  agentsAvailable?: boolean,
  initializedState: ChatInitializedStateType,
  transcript: {[string]: Message},
  platformEvents: {[string]: Event},
  agentTyping: boolean,
  welcomeFormRegistered: boolean,
  messageFieldFocused: boolean,
  configuration: ChatConfiguration,
  isAgentAssigned: boolean,
  inputtingEmail: boolean,
  attachmentErrors: Array<AttachmentError>,
  persistentData: PersistentData,
  windowScrollLockEnabled: boolean,
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
    | 'MUTE_SOUNDS'
    | 'UPDATE_PLATFORM_EVENTS'
    | 'MARK_CHAT_AS_SPAM',
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

export type EventType =
  | 'Join'
  | 'Leave'
  | 'Register'
  | 'AgentTyping'
  | 'SendTranscript'
  | 'End'
  | 'Spam';

export type AuthorType = 'Customer' | 'User' | 'System';
export type MessageType = 'Text' | 'ChatMessage';
export type MessageStatusType = 'pending' | 'delivered';

export type Message = TextMessage | AttachmentMessage;

export type TextMessage = {
  authorType: AuthorType,
  text: string,
  id: string,
  timestamp: number,
  type: 'Text',
  localKey?: string,
  uploadProgress?: number,
};

export type CustomMenuItem = {
  id: string, // Unique Id,
  url: string,
  label?: string,
  title?: string,
  icon?: string,
  itemStyle?: Object,
  iconStyle?: Object,
};

export type AttachmentMessage = {
  id: string,
  localKey?: string,
  timestamp: number,
  type: 'Attachment',
  authorType: AuthorType,
  url: string,
  localBlobUrl: string,
  contentType: string,
  status?: MessageStatusType,
  uploadProgress?: number,
};

export type Event = {
  id: string,
  timestamp: number,
  type: EventType,
  typing?: boolean,
  payload?: any,
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

export type Emoji = {
  id: string,
  name: string,
  colons: string,
  text: string,
  emoticons: Array<string>,
  skin?: number,
  native: string,
};

export type EmojiMetadata = {
  short_names: Array<string>,
};

export type ButtonColor = 'green' | 'grey' | 'gray' | 'red' | 'none';

export type AttachmentError = {
  id: string,
  type: 'attachmentTooLarge' | 'attachmentUnsupportedType' | 'attachmentUploadError',
  timestamp: number,
};
