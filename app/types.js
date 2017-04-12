// @flow
/* eslint-disable no-use-before-define */

export type QuiqObject = {
  CONTACT_POINT: string,
  HOST: string,
  COLOR: string,
  HEADER_TEXT: string,
};

export type EventType = 'Text' | 'Join' | 'Leave';
export type AuthorType = 'Guest' | 'Agent';
export type MessageType = 'Text' | 'ChatMessage';

export type Message = {
  authorType: AuthorType,
  body: string,
  id: string,
  timestamp: number,
  type: EventType,
};

export type Conversation = {
  id: string,
  messages: Array<Message>,
};

export type AtmosphereTransportType =
  'websocket' | 'long-polling' | 'jsonp' | 'sse' | 'streaming' | 'polling';

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
  onOpen?: (response:AtmosphereResponse) => void,
  onReopen?: () => void,
  onReconnect?: (req:AtmosphereRequest, res:AtmosphereResponse) => void,
  onTransportFailure?: (errorMsg:string, request:AtmosphereRequest) => void,
  onMessage?: (response:AtmosphereResponse) => void,
  onError?: (response:AtmosphereResponse) => void,
  onClientTimeout?: (req:AtmosphereRequest) => void,
  onClose?: (response:AtmosphereResponse) => void,
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
    onOpen: (response:AtmosphereResponse) => void,
    onClose: (response:AtmosphereResponse) => void,
    onReopen: () => void,
    onReconnect: (req:AtmosphereRequest, res:AtmosphereResponse) => void,
    onMessage: (response:AtmosphereResponse) => void,
    onTransportFailure: (errorMsg:string, req:AtmosphereRequest) => void,
    onError: (response:AtmosphereResponse) => void,
    onClientTimeout: (req:AtmosphereRequest) => void,
  },
};

export type AtmosphereMessage = {
  data: Message,
  messageType: MessageType,
  tenantId: string,
};

export type IntlMessage = {
  id: string,
  description: string,
  defaultMessage: string,
};

export type IntlObject = {
  formatMessage: (msg: IntlMessage, values?:Object) => string,
  formatDate: (date: number | moment$Moment) => string,
  formatTime: (timestamp:number, options?:Object) => string,
  formatRelative: (date: number) => string,
};

export type ApiError = {
  code?: number,
  message?: string,
  status?: number,
};

export type BrowserNames =
  'Amaya' | 'Android Browser' | 'Arora' | 'Avant' | 'Baidu' | 'Blazer' | 'Bolt' | 'Camino' |
  'Chimera' | 'Chrome' | 'Chromium' | 'Comodo Dragon' | 'Conkeror' | 'Dillo' | 'Dolphin' | 'Doris' |
  'Edge' | 'Epiphany' | 'Fennec' | 'Firebird' | 'Firefox' | 'Flock' | 'GoBrowser' | 'iCab' |
  'ICE Browser' | 'IceApe' | 'IceCat' | 'IceDragon' | 'Iceweasel' | 'IE' | 'IE Mobile' | 'Iron' |
  'Jasmine' | 'K-Meleon' | 'Konqueror' | 'Kindle' | 'Links' | 'Lunascape' | 'Lynx' | 'Maemo' |
  'Maxthon' | 'Midori' | 'Minimo' | 'MIUI Browser' | 'Safari' | 'Safari Mobile' | 'Mosaic' |
  'Mozilla' | 'Netfront' | 'Netscape' | 'NetSurf' | 'Nokia' | 'OmniWeb' | 'Opera' | 'Opera Mini' |
  'Opera Mobi' | 'Opera Tablet' | 'PhantomJS' | 'Phoenix' | 'Polaris' | 'QQBrowser' | 'RockMelt' |
  'Silk' | 'Skyfire' | 'SeaMonkey' | 'SlimBrowser' | 'Swiftfox' | 'Tizen' | 'UCBrowser' | 'Vivaldi'
  | 'w3m' | 'WeChat' | 'Yandex' | null;
export type OSNames = 'AIX' | 'Amiga OS' | 'Android' | 'Arch' | 'Bada' | 'BeOS' | 'BlackBerry' |
  'CentOS' | 'Chromium OS' | 'Contiki' | 'Fedora' | 'Firefox OS' | 'FreeBSD' | 'Debian' |
  'DragonFly' | 'Gentoo' | 'GNU' | 'Haiku' | 'Hurd' | 'iOS' | 'Joli' | 'Linpus' | 'Linux' |
  'Mac OS' | 'Mageia' | 'Mandriva' | 'MeeGo' | 'Minix' | 'Mint' | 'Morph OS' | 'NetBSD' |
  'Nintendo' | 'OpenBSD' | 'OpenVMS' | 'OS/2' | 'Palm' | 'PCLinuxOS' | 'Plan9' | 'Playstation' |
  'QNX' | 'RedHat' | 'RIM Tablet OS' | 'RISC OS' | 'Sailfish' | 'Series40' | 'Slackware' |
  'Solaris' | 'SUSE' | 'Symbian' | 'Tizen' | 'Ubuntu' | 'UNIX' | 'VectorLinux' | 'WebOS' |
  'Windows' | 'Windows Phone' | 'Windows Mobile' | 'Zenwalk' | null;
export type DeviceTypes =
  'console' | 'mobile' | 'tablet' | 'smarttv' | 'wearable' | 'embedded' | null;
