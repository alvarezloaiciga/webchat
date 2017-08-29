export type WelcomeFormField = {
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea',
  label: string,
  id: string,
  required?: boolean,
  rows?: number,
};

export type WelcomeForm = {
  headerText: string,
  fields: Array<WelcomeFormField>,
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
    CUSTOM_CSS_URL?: string,
  },
  welcomeForm?: WelcomeForm,
  href: string,
  fontFamily: string,
  width: number,
  height: number,
  customLaunchButtons: Array<string>,
  showDefaultLaunchButton: boolean,
  mobileNumber?: string | number,
};

export type IntlMessage = {
  id: string,
  description: string,
  defaultMessage: string,
};

export type IntlObject = {
  formatMessage: (msg: IntlMessage, values: ?Object) => string,
  formatDate: (date: number | moment$Moment) => string,
  formatTime: (timestamp: number, options: ?Object) => string,
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
  | 'WebKit'