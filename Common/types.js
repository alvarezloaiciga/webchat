// @flow

import * as QuiqChatTypes from 'quiq-chat/src/types';

export type ReduxStore = {dispatch: any => any, getState: () => ChatState};

/**
 * The options in this object control the entire chat experience, from specifying a contact point to customizing the style of nearly every component of the UI.
 * Pass an object of this type to the `Quiq()` initialization function.
 *
 * !> We provide a wide array of customization options to ensure that Chat can meet user experience vision. If you need any assistance in customizing Chat, please don't hesitate to reach out to our support team.
 *
 * @alias Options
 * @example
 * // Define customization options
 * var options = {
 *    tenant: 'awesome-company',
 *    contactPoint: 'default',
 *    autoPopTime: 10000,               // Automatically show chat 10 seconds after page load
 *    colors: {
 *        primary: '#68b588',           // Theme color to match Awesome Company's brand
 *    },
 *    messages: {
 *        sendButtonLabel: 'Send it!',  // Override text on send button
 *    },
 * };
 *
 * // Call the Quiq() function with this object to initialize Webchat
 * var chat = Quiq(options);
 *
 * @property [displayMode="either"] - Controls how chat is presented to the user: `either` indicates that webchat is launched as a "docked" frame on your page, but can be switched to a standalone window (and back) by the user. `undocked` indicates that webchat is launched directly into a standalone window and cannot be switched to a docked frame. `docked` indicates that webchat is launched into a frame on your page and cannot be switched to a standalone window by the user. We recommend `either` mode for most use cases.
 * @property [agentsAvailableTimer=60000] - The amount of time, in milliseconds, between agent availability checks.
 * @property autoPopTime - Number, in milliseconds, until the webchat automatically pops open on its own. Leave undefined to disable.
 * @property colors - An object containing color values for the chat UI.
 * @property events - Options for customizing the display of conversation events such as conversation ended, email transcript, etc.
 * @property [contactPoint="default"] - **(Required)** The contact point for this webchat interface
 * @property customLaunchButtons - Array of [selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Simple_selectors) pointing at elements that exist on page load that should act as a launcher for chat. If the `customLaunchButtons` array is populated, the default launcher button is removed, unless `showDefaultLauncButton` is explicitly set to `true`. Note that it is important that the selectors be unique as the first occurrence of the selector will be used as the launcher. The following css classes will be appended to the custom launch buttons in the following cases:
 * <ul>
 *    <li>**.noAgentsAvailable** - There are no agents available to chat. This could mean they are at their queue limits, or are offline.</li>
 *    <li>**.mobile** - The user is on a non-desktop environment</li>
 *    <li>**.unsupportedBrowser** - The user is using a browser unsupported by Quiq</li>
 *    <li>**.storageDisabled** - Quiq is unable to access window.localStorage, which is required for chat to function.</li>
 *    <li>**.hasMobileNumber** - The `mobileNumber` option has been defined.</li>
 * </ul>
 * @property showDefaultLaunchButton - Normally, if `customLaunchButtons` are defined, the default launch button is not shown. This property allows for overriding this behavior to either show the default launch button (`true`) or hide the default launch button (`false`) regardless of whether any `customLaunchButtons` are defined.
 * @property customScreens - Definition of the custom screens that can be displayed in web chat.
 * @property icons - Defines favicons and other icons for use by the browser. Note that these images **must** be served over HTTPS. *Please note: the only browsers which will display a custom favIcon in the title bar are Chrome and IE on Windows. On other browsers, custom icons are only used for bookmarks.*
 * @property [enforceAgentAvailability=`true`] - Determines if the chat application respects if there are agents available or not.
 * @property excludeEmojis - An array of emoji names to not allow. Emojis with names in this array will _not_ be shown in the emoji picker or sent in messages. Emojis identified in this array will be stripped from customer messages prior to sending. For a list of emoji names, please use [Emoji Cheatsheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/). Note that you should not include the surrounding colons when copying names from the cheat sheet. **The `includeEmojis` field takes precedence over this field.**
 * @property includeEmojis - An array of emoji names to allow. Only emojis with names in this array will be shown in the emoji picker and sent in messages. Emojis not identified in this array will be stripped from customer messages prior to sending. To disable the emoji picker completely, set this field to be an empty array (`[]`). For a list of emoji names, please use [Emoji Cheatsheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/). Note that you should not include the surrounding colons when copying names from the cheat sheet. **This field takes priority over `excludeEmojis`.**
 * @property [fontFamily="sans-serif"] - Font Family of all text within the chat UI. Can be multiple values, as long as they are valid css values
 * @property [height=600] -  The max height (px) of the chat UI.
 * @property [host="<tenant>.goquiq.com"] - The hostname to operate against. **You generally should not need to set this; we determine it automatically.**
 * @property messages -  Custom static strings to use in various places throughout the chat client.
 * @property mobileNumber - If the user is on a mobile device, chat will not show. Instead, when the user taps on the launch button their SMS app will open with the `to` field set to this value. If `mobileNumber` is not defined, that chat launcher button is not visible on mobile devices.
 * @property position - Initial position for the chat window
 * @property styles -  Options to customize the look and feel of your webchat client. See [Setting Styles](#setting-styles) for available options
 * @property [width=400] - The width (px) of the Chat UI
 * @property welcomeForm - Object describing a web form that should display to new users before they are connected with an agent. Leave undefined to disable. If fields with and an `id` of `firstName` and `lastName` are defined, Quiq will use the values of these form fields to set the first and last name of the customer within the Agent UI. If the `isInitialMessage` value is set on a field, then it is intended to appear as initial question to the user, and if a value is provided, then this field will be sent as an initial message for the chat.
 */
export type QuiqObject = {
  displayMode: 'docked' | 'undocked' | 'either',
  agentsAvailableTimer: number,
  anchorElement: string,
  autoPopTime?: number,
  colors: Colors,
  events: EventsOptions,
  contactPoint: string,
  customLaunchButtons: Array<string>,
  showDefaultLaunchButton: boolean,
  customScreens: CustomScreens,
  icons: {
    favicon?: string,
    appleTouchIcon?: string,
  },
  enforceAgentAvailability: boolean,
  excludeEmojis?: Array<string>,
  includeEmojis?: Array<string>,
  fontFamily: string,
  height: number,
  host: string,
  defaultCustomerAvatar?: string,
  defaultAgentAvatar?: string,
  messages: Messages,
  mobileNumber?: string | number,
  position: Position,
  styles: CustomStyles,
  width: number,
  clientDomain: string,
  color: string, // Deprecated in favor styles object
  headerText: string, // Deprecated in favor of messages object
  href: string,
  localStorageKeys: {[string]: any},
  _internal: {
    captureRequests?: boolean,
    captureWebsockets?: boolean,
    exposeDraftJsFunctions?: boolean,
  },
  registrationFormFieldValues?: {[string]: any},
};

/**
 * An `Object` describing where to position the Webchat UI on your page. Values can be an valid CSS unit specifier.
 * @example
 * {
       bottom: 0,
       right: '20px',
   }
 */
export type Position = {
  top?: number | string,
  bottom?: number | string,
  left?: number | string,
  right?: number | string,
};

/**
 * An `Object` describing custom IFrames to be displayed at various points throughout a conversation.
 * @property waitScreen - Wait Screen that is displayed when the user is waiting for an agent.
 * @example
 * {
 *     waitScreen: {
 *       url: 'https://mysite.com/waitscreen.html',        // URL to point the wait screen to
 *       height: 200,                                      // Height of the screen, if undefined, the wait screen take up the entire transcript
 *       minHeight: 50,                                    // The minimum of the screen that it can shrink to before the transcript starts to scroll.
 *     }
 *   }
 */
export type CustomScreens = {
  waitScreen?: {
    url: string,
    height?: number,
    minHeight?: number,
  },
};

/**
 * An ~Object~ describing options for conversation events displayed in the chat transcript.
 * @property [showTime=`true] - Whether to show the time an event occurred next to the event name in the chat transcript.
 * @example
 * {
 *     showTime: false  // Don't display time of events
 * }
 */
export type EventsOptions = {
  showTime: boolean,
};

/**
 * An `Object` defining colors used to define the theme of chat. You do not need to include all the keys.
 * Any valid CSS color string may be used--hex, rgb or name.
 * For example, a red color can be written as `#FF0000`, `rgb(255, 0, 0)` or `red`.
 * For even finer-grained theme control,
 * use the `styles` property of the options object to provide custom CSS styling for various components.
 * @property [primary="#59ad5d"] - The principal UI color. Oftentimes the only color you'll need to provide to achieve a branded look.
 * @property [error="#ad2215"] - Color used for elements that indicate an error, could be background or foreground color.
 * @property [eventText="#888"] - Text color for Event messages
 * @property [menuText="#2199e8"] - Text color for primary menu
 * @property [agentMessageText="#000"] - Text color for messages sent by the support agent
 * @property [agentMessageLinkText="#2199e8"] - Text color for links sent by the support agent
 * @property [agentMessageBackground="#fff"] - Message bubble color for links sent by the support agent
 * @property [customerMessageText="#fff"] - Text color for messages sent by the end user
 * @property [customerMessageLinkText="#fff"] - Text color for links sent by the end user
 * @property [customerMessageBackground=`primary`] - Message bubble color for links sent by the end user
 * @property [attachmentMessageColor="#888"] - Color used for icon, text and border of a file attachment message
 * @property [transcriptBackground="#f4f4f8"] - Background color for the chat window
 * @property [typingIndicatorForeground="#2199e8"] - Foreground of the typing indicator gradient. Flashes between `typingIndicatorBackground`
 * @property [typingIndicatorBackground="#66b9ef"] - Background of the typing indicator gradient. Flashes between `typingIndicatorForeground`
 * @property browserTheme - Theme color used by some browsers (e.g. Chrome for Android) to style the address bar and other browser components
 * @property [shadow="rgba(0, 0, 0, 0.117647)"] - Color of drop shadow displayed around chat. Set to `null` to not display a shadow
 */
export type Colors = {
  primary: string,
  error: string,
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
  shadow: string | null,
};

/**
 * An `Object` containing string overrides for static strings shown throughout chat.
 * You only need to specify values for strings for which you would like to override the default value.
 * For descriptions and default values of each string, see [Strings](/strings)
 */
export type Messages = {
  pageTitle: string,
  titleText: string,
  headerText: string,
  messageFieldPlaceholder: string,
  invalidEmailErrorMessage: string,
  welcomeFormValidationErrorMessage: string,
  welcomeFormSubmitButtonLabel: string,
  welcomeFormSubmittingButtonLabel: string,
  agentTypingMessage: string,
  agentAssignedMessage: string,
  agentEndedConversationMessage: string,
  agentsNotAvailableMessage: string,
  connectingMessage: string,
  reconnectingMessage: string,
  errorMessage: string,
  requiredFieldAriaLabel: string,
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
  unsupportedOrientation: string,
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
  registrationFormVersionId?: string | null,
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

/**
 * An `Object` describing form fields to display in the Welcome Form
 * for collecting information about the customer prior to the conversation.
 * @property type - The type of input to display. Except for the `select` type, all will display text boxes with input validation corresponding to the type.
 * For example, the `email` type will ensure that the value entered by the user is a valid email before they scan submit the form.
 * If you choose the `select` type, provide the choices as an array of objects in the `options` field.
 * @property label - The text to be displayed next to this field in the UI.
 * @property id - The unique identifier used to represent this field.
 * @property rows - If the `type` is set to "textarea", this value specifies how many rows should be shown in the textarea element.
 * @property isInitialMessage - When set to `true`, the value of this field will be sent as a message form the customer immediately after they submit the form.
 * @property options - If the `type` is set to "select", this array represents the choices in the dropdown. Each object in the array must contain both a `value` and `label` key.
 */
export type WelcomeFormField = {
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select',
  label: string,
  id: string,
  required?: boolean,
  rows?: number,
  isInitialMessage?: boolean,
  options?: Array<{value: string, label: string}>,
  additionalProperties: {
    options?: string,
    rows?: number,
    isInitialMessage?: boolean,
    isHidden?: boolean,
  },
};

/**
 * An `Object` representing a key-value pair of chat user info.
 * @example
 * {
 *    id: 'firstName',
 *    value: 'Zach',
 * }
 */
export type RegistrationField = {
  id: string,
  value: string,
};

/**
 * Object describing a web form that should display to new users before they are connected with an agent. If fields with and an `id` of `firstName` and `lastName` are defined, Quiq will use the values of these form fields to set the first and last name of the customer within the Agent UI. If the `isInitialMessage` value is set on a field, then it is intended to appear as initial question to the user, and if a value is provided, then this field will be sent as an initial message for the chat.
 * @property headerText - A message to display at the top of the form.
 * @property fields - An array of ~WelcomeFormField` specifying inputs to include in the form.
 * @example
 * {
      headerText: 'Please tell us a little about yourself.',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          required: false
        },
        {
          id: 'numberField',
          type: 'number',
          label: 'Number Field',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-Mail',
          required: true
        },
        {
          id: 'initialQuestion',
          type: 'textarea',
          label: 'Initial Question',
          required: true,
          isInitialMessage: true,
        },
        {
          type: 'select',
          label: 'Selection Field',
          id: 'selectionField',
          required: true,
          options: [{value: '', label: '---'}, {value: 'USA', label: 'United States'}, {value: 'Canada', label: 'Canada'}, {value: 'Mexico', label: 'Mexico'}]
        },
      ]
    }
 */
export type WelcomeForm = {
  headerText: string,
  fields: Array<WelcomeFormField>,
};

/**
 * An `Object` containing style definitions to customize the Chat UI. These are essentially turned into inline CSS styles, so you can use all available CSS properties.
 * Properties are named the same as in CSS, except that they are camelCased. For example:

 ```css
 font-size: 18px;
 ```

 becomes

 ```javascript
 fontSize: '18px',
 ```

 Styles are not auto-prefixed. Vendor prefixes other than `ms` should be capitalized:

 ```javascript
 {
   transition: 'all',
   WebkitTransition: 'all',
   msTransition: 'all'
 }
 ```
 
 * @property AgentAvatar - The avatar that shows up for the support agent. (By default there is nothing here)
 * @property AgentMessageBubble - The message bubble for messages that the support agent sent
 * @property AgentMessageText - The text for messages that the support agent sent
 * @property AgentAttachmentBubble - The message bubble that file attachments are displayed in. Does not affect image attachments.
 * @property AgentAttachmentText - The text and icon that is displayed inside an attachment message bubble.
 * @property CustomerAvatar - The avatar that shows up for the customer. (By default there is nothing here)
 * @property CustomerMessageBubble - The message bubble for messages that the customer sent
 * @property CustomerMessageText - The text for messages that the customer sent
 * @property CustomerAttachmentBubble - The message bubble that file attachments are displayed in. Does not affect image attachments.
 * @property CustomerAttachmentText - The text and icon that is displayed inside an attachment message bubble.
 * @property MessageErrorText - The error description text that is displayed below a message that failed to send.
 * @property EmailTranscriptInput - Input where user inputs an email to receive a transcript of the conversation.
 * @property EmailTranscriptInputCancelButton - Cancel button for the `EmailTranscriptInput`
 * @property EmailTranscriptInputContainer - Container for the input where user inputs an email to receive a transcript of the conversation.
 * @property EmailTranscriptInputSubmitButton - Submit button for the `EmailTranscriptInput`.
 * @property ErrorBanner - The banner that is shown when there is a connection error.
 * @property EventContainer - Container for Event messages.
 * @property EventLine - SVG portion of Event elements.
 * @property EventText - Text portion of Event elements.
 * @property HeaderBanner - The banner that is shown above the chat transcript.
 * @property HeaderMenu - The top section of the chat container that contains the minimize, maximize, and close icons.
 * @property HeaderMenuIcons - The icons inside `HeaderMenu`. Note that these icons are SVG's, so be sure to use the corresponding styles. To set color for example, use the `fill` property.
 * @property InlineActionButton - Button that displays below an event in the transcript.
 * @property MessageForm - The form at the bottom of the chat that holds the text box and send button.
 * @property MessageFormInput - The text box for sending messages.
 * @property MessageFormSend - The send button for the chat.
 * @property NonChat - Message Area that displays in place of chat when chat is unable to display. Only Displays if the `unsupportedBrowser` or `storageDisabled` message is set, and the client's browser fails one of these checks.
 * @property OptionsMenuButton - Button container for the Options menu at the bottom left of the web chat.
 * @property OptionsMenuButtonIcon - Icon for the `OptionsMenuButton`.
 * @property OptionsMenuContainer - Container for the Menu that pops when clicking the `OptionsMenuButton`.
 * @property OptionsMenuLineItem - Individual line items within the `OptionsMenuContainer`.
 * @property OptionsMenuLineItemIcon - Icon for individual `OptionsMenuLineItem`.
 * @property ToggleChatButton - The button in the bottom corner that opens the chat.
 * @property TitleText - The text that appears in the upper left of the chat container, corresponding to the `TitleText` message.
 * @property ToggleChatButtonIcon - The icon in the `ToggleChatButton`.
 * @property TypingIndicatorSvgStyle - SVG Container of the agent typing indicator.
 * @property TypingIndicatorCircleStyle - Styling for the three SVG circles that appear within the SVG Container of the agent typing indicator.
 * @property WelcomeFormBanner - The banner that is shown above the welcome form.
 * @property WelcomeFormField - A field in the welcome form.
 * @property WelcomeFormFieldInput - The input for single line fields in the welcome form.
 * @property WelcomeFormFieldLabel - The label for fields in the welcome form.
 * @property WelcomeFormFieldTextarea - The textarea for multi-line fields in the welcome form.
 * @property WelcomeFormFieldSelect - The input for select fields in the welcome form.
 * @property WelcomeFormFieldOptions - The input for select field options in the welcome form.
 * @property WelcomeFormSubmitButton - The submit button for the welcome form.
 */
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
  MessageErrorText?: Object,
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
  typingAuthor: ?QuiqChatTypes.Author,
  welcomeFormRegistered: boolean,
  messageFieldFocused: boolean,
  configuration: ChatConfiguration,
  isAgentAssigned: boolean,
  inputtingEmail: boolean,
  attachmentErrors: Array<AttachmentError>,
  persistentData: QuiqChatTypes.PersistentData,
  windowScrollLockEnabled: boolean,
  registrationFieldValues: {[string]: any},
};

export type Action = {
  type:
    | 'CHAT_CONTAINER_HIDDEN'
    | 'CHAT_REGISTRATION_FIELD_SET'
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
  | 'burned';

export type CookieDef = {
  id: string,
  expiration?: number,
  path?: string,
};

export type AuthorType = 'Customer' | 'User' | 'System';
export type MessageType = 'Text' | 'ChatMessage';
export type MessageStatusType = 'pending' | 'delivered';

export type TextMessage = QuiqChatTypes.TextMessage & {
  localKey?: string,
  failureReason?: string,
  status?: string,
};

export type AttachmentMessage = QuiqChatTypes.AttachmentMessage & {
  localKey?: string,
  localBlobUrl: string,
  uploadProgress?: number,
  failureReason?: string,
  status?: string,
};

export type Message = TextMessage | AttachmentMessage;

export type CustomMenuItem = {
  id: string, // Unique Id,
  url: string,
  label?: string,
  title?: string,
  icon?: string,
  itemStyle?: Object,
  iconStyle?: Object,
};

export type Event = QuiqChatTypes.Event;

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
  data?: Object,
};
