<!-- NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE
 If you update this document, and it will affect the table of contents, be sure to generate a new table of contents at https://ecotrust-canada.github.io/markdown-toc/
     NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE -->

# Quiq WebChat [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

- [Webchat Client](#webchat-client)
  * [Enabling Webchat on your Tenant](#enabling-webchat-on-your-tenant)
  * [Adding Webchat to your site - Quiq Start](#adding-webchat-to-your-site---quiq-start)
  * [Customizing The Webchat Client](#customizing-the-webchat-client)
    + [agentsAvailableTimer](#agentsavailabletimer)
    + [autoPopTime](#autopoptime)
    + [colors](#colors)
    + [contactPoint](#contactpoint)
    + [customLaunchButtons](#customlaunchbuttons)
    + [showDefaultLaunchButton](#showdefaultlaunchbutton)
    + [customScreens](#customscreens)
    + [displayMode](#displaymode)
    + [enforceAgentAvailability](#enforceagentavailability)
    + [events](#events)
    + [includeEmojis](#includeemojis)
    + [excludeEmojis](#excludeemojis)
    + [fontFamily](#fontfamily)
    + [height](#height)
    + [host](#host)
    + [messages](#messages)
    + [mobileNumber](#mobilenumber)
    + [position](#position)
    + [styles](#styles)
    + [welcomeForm](#welcomeform)
    + [width](#width)
  * [Setting Styles](#setting-styles)
    + [Available Elements](#available-elements)
      - [AgentAvatar](#agentavatar)
      - [AgentMessageBubble](#agentmessagebubble)
      - [AgentMessageText](#agentmessagetext)
      - [AgentAttachmentBubble](#agentattachmentbubble)
      - [AgentAttachmentText](#agentattachmenttext)
      - [CustomerAvatar](#customeravatar)
      - [CustomerMessageBubble](#customermessagebubble)
      - [CustomerMessageText](#customermessagetext)
      - [CustomerAttachmentBubble](#customerattachmentbubble)
      - [CustomerAttachmentText](#customerattachmenttext)
      - [EmailTranscriptInput](#emailtranscriptinput)
      - [EmailTranscriptInputCancelButton](#emailtranscriptinputcancelbutton)
      - [EmailTranscriptInputContainer](#emailtranscriptinputcontainer)
      - [EmailTranscriptInputSubmitButton](#emailtranscriptinputsubmitbutton)
      - [EmailTranscriptMenuContainer](#emailtranscriptmenucontainer)
      - [EmailTranscriptMenuLineItem](#emailtranscriptmenulineitem)
      - [EmailTranscriptMenuLineItemIcon](#emailtranscriptmenulineitemicon)
      - [ErrorBanner](#errorbanner)
      - [EventContainer](#eventcontainer)
      - [EventLine](#eventline)
      - [EventText](#eventtext)
      - [HeaderBanner](#headerbanner)
      - [HeaderMenu](#headermenu)
      - [HeaderMenuIcons](#headermenuicons)
      - [InlineEmailTranscriptButton](#inlineemailtranscriptbutton)
      - [MessageForm](#messageform)
      - [MessageFormInput](#messageforminput)
      - [MessageFormSend](#messageformsend)
      - [NonChat](#nonchat)
      - [OptionsMenuButton](#optionsmenubutton)
      - [OptionsMenuButtonIcon](#optionsmenubuttonicon)
      - [ToggleChatButton](#togglechatbutton)
      - [TitleText](#titletext)
      - [ToggleChatButtonIcon](#togglechatbuttonicon)
      - [TypingIndicatorSvgStyle](#typingindicatorsvgstyle)
      - [TypingIndicatorCircleStyle](#typingindicatorcirclestyle)
      - [WelcomeFormBanner](#welcomeformbanner)
      - [WelcomeFormField](#welcomeformfield)
      - [WelcomeFormFieldInput](#welcomeformfieldinput)
      - [WelcomeFormFieldLabel](#welcomeformfieldlabel)
      - [WelcomeFormFieldTextarea](#welcomeformfieldtextarea)
      - [WelcomeFormSubmitButton](#welcomeformsubmitbutton)
- [SDK](#sdk)
  * [The Quiq object](#the-quiq-object)
    + [getChatStatus](#getchatstatus)
    + [getAgentAvailability](#getagentavailability)
    + [getChatVisibility](#getchatvisibility)
    + [getHandle](#gethandle)
    + [on](#on)
    + [setChatVisibility](#setchatvisibility)
    + [sendRegistration](#sendregistration)
- [Extension SDK](#extension-sdk)
  * [on](#on-1)
- [Supported Browsers](#supported-browsers)

## Webchat Client

### Enabling Webchat on your Tenant
To enable Webchat on your Quiq tenant, you will need to reach out to your Quiq representative.

### Adding Webchat to your site - Quiq Start
To get started with the standard Webchat setup, include `quiq.js` on your page by adding the following script tag into the `<head>` of your HTML:
(Replace `<tenant>` with the name of your Quiq tenant.)

  ```javascript
  <script src="https://<tenant>.goquiq.com/app/webchat/index.js"></script>
  ```

Next, setup Webchat by calling the `Quiq()` function in the body of your page  2:

  ```javascript
  var chat = Quiq({
    host: 'https://tenant.goquiq.com',
    contactPoint: 'default'
  });
  ```

You should replace `tenant` with your own tenant handle. If you would like Webchat to send messages to a specific Contact Point, replace `default` with Contact Point's name.

**That's it!** A launch button should now be visible in the lower-right corner of your page, and a fully functioning chat UI will appear when clicked.

Read on to learn how to style the UI to match your brand, listen for webchat events, add custom launch buttons and more.

### Customizing The Webchat Client
The Quiq() function contains properties describing how the instance of webchat should act.  All properties are optional.
  - #### agentsAvailableTimer
    - type: number
    - description: The amount of time, in milliseconds, between agent availability checks.
    - default: 60000
  - #### autoPopTime
    - type: number
    - description: Number, in milliseconds, until the webchat automatically pops open on its own. Leave undefined to disable.
    - default: `undefined`
    - example: `2000`
  - #### colors
    - type:
      ```javascript
      {
        primary: string,
        menuText: string, //  Text color for primary menu
        eventText: string, // Text color for Event messages
        agentMessageText: string, // Text color for messages sent by the support agent
        agentMessageLinkText: string, // Text color for links sent by the support agent
        agentMessageBackground: string, // Message bubble color for links sent by the support agent
        customerMessageText: string, // Text color for messages sent by the end user
        customerMessageLinkText: string, // Text color for links sent by the end user
        customerMessageBackground: string, // Message bubble color for links sent by the end user
        attachmentMessageColor: string, // Color used for icon, text and border of a file attachment message.
        transcriptBackground: string, // Background color for the chat window
        typingIndicatorForeground: string, // Foreground of the typing indicator gradient. Flashes with `typingIndicatorBackground`
        typingIndicatorBackground: string, // Background of the typing indicator gradient. Flashes with `typingIndicatorForeground`
      }
      ```
    - description: Color values for the webchat
    - defaults:
      ```javascript
      {
        primary: '#59ad5d',
        menuText: '#2199e8',
        eventText: '#888',
        agentMessageText: '#000',
        agentMessageLinkText: '#2199e8',
        agentMessageBackground: '#fff',
        customerMessageText: '#fff',
        customerMessageLinkText: '#fff',
        customerMessageBackground: COLORS.primary,
        transcriptBackground: '#f4f4f8',
        typingIndicatorForeground: '#2199e8',
        typingIndicatorBackground: '#66b9ef',
      }
      ```
  - #### contactPoint
    - type: string
    - description: The contact point for this webchat interface
    - default: `'default'`
    - example: `'default'`
  - #### customLaunchButtons
    - type: Array<string>
    - description: List of [selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Simple_selectors) pointing at elements that exist on page load that should act as a launcher for chat. If the `customLaunchButtons` array is populated, the default launcher button is removed, unless `showDefaultLauncButton` is explicitly set to `true`..  Note that it is important that the selectors be unique as the first occurrence of the selector will be used as the launcher.
    - default: `[]`
    - example: `['.customButtonClass1', '#customButtonId2']`
    - The following css classes will be appending to the custom launch buttons in the following cases.
      - `.noAgentsAvailable` - There are no agents available to chat.  This could mean they are at their queue limits, or are offline.
      - `.mobile` - The user is on a non-desktop environment
      - `.unsupportedBrowser` - The user is using a browser unsupported by Quiq
      - `.storageDisabled` - Quiq is unable to access window.localStorage, which is required for chat to function.
      - `.hasMobileNumber` - The MOBILE_NUMBER Quiq property is defined.
  - #### showDefaultLaunchButton
      - type: boolean
      - description: Normally, if `customLaunchButtons` are defined, the default launch button is not shown. This property allows for overriding this behavior to either show the default launch button (`true`) or hide the default launch button (`false`) regardless of whether any `customLaunchButtons` are defined.
      - default: `undefined`
      - example: `true`
  - #### customScreens
    - type:
    ```javascript
    {
      waitScreen?: {        // Wait Screen that is displayed when the user is waiting for an agent.
        url: string,        // URL to point the wait screen to
        height?: number,    // Height of the screen, if undefined, the wait screen take up the entire transcript
        minHeight?: number, // The minimum of the screen that it can shrink to before the transcript starts to scroll.
      }
    }
    ```
  - description: Definition of the custom screens that can be displayed in web chat.
  - defaults:
    ```javascript
    {
    }
    ```
  - #### displayMode
    - type: 'either' | 'docked' | 'undocked'
    - description: Controls how webchat is presented to the user: `either` indicates that webchat is launched as a "docked" frame on your page, but can be switched to a standalone window (and back) by the user. `undocked` indicates that webchat is launched directly into a standalone window and cannot be switched to a docked frame. `docked` indicates that webchat is launched into a frame on your page and cannot be switched to a standalone window by the user. We recommend `either` mode for most use cases. 
    - default: `either`
    - example: `undocked`
  - #### enforceAgentAvailability
    - type: boolean
    - description: Determines if the webchat application respects if there are agents available or not.
    - default: true
  - #### events
    - type: ```javascript
      {
        showTime: boolean   // Controls whether the time an event took place is shown along with the event description.
      }
      ```
    - description: Options for customizing the display of conversation events such as conversation ended, email transcript, etc.
    - default: ```javascript
      {
        showTime: true
      }
      ```
  - #### includeEmojis
    - type: Array<string>
    - description: An array of emoji names to allow. Only emojis with names in this array will be shown in the emoji picker and sent in messages. Emojis not identified in this array will be stripped from customer messages prior to sending. To disable the emoji picker completely, set this field to be an empty array (`[]`). For a list of emoji names, please use [Emoji Cheatsheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/). Note that you should not include the surrounding colons when copying names from the cheat sheet. **This field takes priority over `excludeEmojis`.**
    - default: `[]`
    - example: `['hatching_chick', 'stuck_out_tongue']`
  - #### excludeEmojis
    - type: Array<string>
    - description: An array of emoji names to not allow. Emojis with names in this array will *not* be shown in the emoji picker or sent in messages. Emojis identified in this array will be stripped from customer messages prior to sending. For a list of emoji names, please use [Emoji Cheatsheet](https://www.webpagefx.com/tools/emoji-cheat-sheet/). Note that you should not include the surrounding colons when copying names from the cheat sheet. **The `includeEmojis` field takes precedence over this field.**
    - default: `[]`
    - example: `['hatching_chick', 'stuck_out_tongue']`
  - #### fontFamily
    - type: string
    - description: Font Family of all text within the webchat.  Can be multiple values, as long as they are valid css values
    - default: `'sans-serif'`
    - example: `'Lato, sans-serif'`
  - #### height
    - type: number
    - description: The max height (px) of the webchat
    - default: `600`
    - example: `600`
  - #### host
    - type: string
    - description: The hostname to operate against. In production, this should always be goquiq.com, and shouldn't need to be manually set
    - default: `'goquiq.com'`
  - #### messages
    - type:
      ```javascript
      {
        pageTitle: string,
        titleText: string,
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
        unsupportedBrowser?: string,
        storageDisabled?: string,
        agentEndedConversationMessage: string,
        agentsNotAvailableMessage: string,
        optionsMenuTooltip: string,
        emailTranscriptInlineButton: string,
        emailTranscriptMenuMessage: string,
        emailTranscriptMenuTooltip: string,
        emailTranscriptInputPlaceholder: string,
        emailTranscriptInputCancelTooltip: string,
        emailTranscriptInputSubmitTooltip: string,
        messageArrivedNotification: string,
        transcriptEmailedEventMessage: string,
      }
      ```
    - description: Custom static strings to use in various places throughout the chat client.
    - default:
      ```javascript
      {
        pageTitle: "Quiq Webchat",
        titleText: "",
        headerText: "We're here to help if you have any questions!",
        sendButtonLabel: 'Send',
        messageFieldPlaceholder: 'Send us a message...',
        welcomeFormValidationErrorMessage: 'Please complete all fields marked with an *',
        welcomeFormSubmitButtonLabel: 'Submit',
        welcomeFormSubmittingButtonLabel: 'Submitting',
        agentTypingMessage: 'Agent is typing',
        connectingMessage: 'Connecting...',
        reconnectingMessage: 'Reconnecting...',
        errorMessage: "We're having trouble connecting. Try refreshing the page.",
        requiredFieldAriaLabel: 'Required',
        minimizeWindowTooltip: 'Minimize window',
        dockWindowTooltip: 'Dock chat',
        openInNewWindowTooltip: 'Open chat in new window',
        closeWindowTooltip: 'Close window',
        emojiPickerTooltip: 'Emoji picker',
        attachmentBtnTooltip: 'Send file',
        unsupportedBrowser: undefined,
        storageDisabled: undefined,
        agentEndedConversationMessage: 'Agent has ended the conversation.',
        agentsNotAvailableMessage: 'No agents are currently available.',
        optionsMenuTooltip: 'Options',
        emailTranscriptInlineButton: 'Email Transcript',
        emailTranscriptMenuMessage: 'Email Transcript',
        emailTranscriptMenuTooltip: 'Email a full transcript of the current chat',
        emailTranscriptInputPlaceholder: 'Enter your Email...',
        emailTranscriptInputCancelTooltip: 'Cancel Email Transcript',
        emailTranscriptInputSubmitTooltip: 'Email Transcript',
        messageArrivedNotification: 'New Message from Quiq Webchat'
        transcriptEmailedEventMessage: 'Transcript Emailed',
      }
      ```
  - #### mobileNumber
    - type: number | string,
    - description: If the user is on a mobile device, chat will not show. Instead, when the user taps on the launch button their SMS app will open with the `to` field set to this value. If `mobileNumber` is not defined, that chat launcher button is not visible on mobile devices.
    - default: none
    - examples: `1234567891`, `"+15556667777"`
  - #### position
    - type:
      ```javascript
      {
        top?: string | number,
        bottom?: string | number,
        left?: string | number,
        right?: string | number,
      }
      ```
    - description: Initial position for the chat window
    - default: `{}`
    - example:
      ```javascript
      position: {
        bottom: 0,
        right: '20px',
      }
      ```
  - #### styles
    - type: Object
    - description: Options to customize the look and feel of your webchat client. See [Setting Styles](#setting-styles) for available options
    - default: `{}`
    - example:
      ```javascript
      styles: {
        HeaderBanner: {
          fontSize: 18,
          margin: '8px 4px'
        }
      }
      ```
  - #### welcomeForm
    - type:
      ```javascript
      {
        headerText?: string,
        fields: [
          {
            id: string,
            type: 'text' | 'textarea' | 'number' | 'email' | 'tel',
            label: string,
            required: boolean,
            rows: number, // Only applicable if type is textarea
            isInitialMessage: boolean,
          },
        ]
      }
      ```
    - description: Object describing a web form that should display to new users before they are connected with an agent. Leave undefined to disable. If fields with and an `id` of `firstName` and `lastName` are defined, Quiq will use the values of these form fields to set the first and last name of the customer within the Agent UI. If the `isInitialMessage` value is set on a field, then it is intended to appear as initial question to the user, and if a value is provided, then this field will be sent as an initial message for the chat.
    - default: `undefined`
    - example:
      ```js
        welcomeForm: {
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
            }
          ]
        }
      ```
  - #### width
    - type: number
    - description: The width (px) of the webchat
    - default: `400`
    - example: `400`

### Setting Styles
Values passed into the `styles` property of the `Quiq` object will be applied to the elements using inline styles. Properties are named the same as in CSS, except that they are camelCased. For example:
  ```
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

#### Available Elements
To use any of the following elements, specify them within the stlyes object, like so

  ```javascript
  Quiq({
    styles: {
      HeaderMenu: {
        backgroundColor: '#aaa',
      }
    }
  })
  ```
##### AgentAvatar
The avatar that shows up for the support agent. (By default there is nothing here)

##### AgentMessageBubble
The message bubble for messages that the support agent sent

##### AgentMessageText
The text for messages that the support agent sent

##### AgentAttachmentBubble
The message bubble that file attachments are displayed in. Does not affect image attachments.

##### AgentAttachmentText
The text and icon that is displayed inside an attachment message bubble.

##### CustomerAvatar
The avatar that shows up for the customer. (By default there is nothing here)

##### CustomerMessageBubble
The message bubble for messages that the customer sent

##### CustomerMessageText
The text for messages that the customer sent

##### CustomerAttachmentBubble
The message bubble that file attachments are displayed in. Does not affect image attachments.

##### CustomerAttachmentText
The text and icon that is displayed inside an attachment message bubble.

##### EmailTranscriptInput
Input where user inputs an email to receive a transcript of the conversation

##### EmailTranscriptInputCancelButton
Cancel button for the `EmailTranscriptInput`

##### EmailTranscriptInputContainer
Container for the input where user inputs an email to receive a transcript of the conversation

##### EmailTranscriptInputSubmitButton
Submit button for the `EmailTranscriptInput`

##### EmailTranscriptMenuContainer
Container for the Menu that pops when clicking the `OptionsMenuButton`

##### EmailTranscriptMenuLineItem
Individual line items within the `EmailTranscriptMenuContainer`

##### EmailTranscriptMenuLineItemIcon
Icon for individual `EmailTranscriptMenuLineItems`

##### ErrorBanner
The banner that is shown when there is a connection error

##### EventContainer
Container for Event messages

##### EventLine
SVG portion of Event elements

##### EventText
Text portion of Event elements

##### HeaderBanner
The banner that is shown above the chat transcript

##### HeaderMenu
The top section of the chat container that contains the minimize, maximize, and close icons

##### HeaderMenuIcons
The icons inside `HeaderMenu`

##### InlineEmailTranscriptButton
Button that displays inline when the agent ends a conversation allowing user to request an email transcript of the conversation

##### MessageForm
The form at the bottom of the chat that holds the text box and send button

##### MessageFormInput
The text box for sending messages

##### MessageFormSend
The send button for the chat

##### NonChat
Message Area that displays in place of chat when chat is unable to display. Only Displays if the `unsupportedBrowser` or `storageDisabled` message is set, and the client's browser fails one of these checks.

##### OptionsMenuButton
Button container for the Options menu at the bottom left of the web chat

##### OptionsMenuButtonIcon
Icon for the `OptionsMenuButton`

##### ToggleChatButton
The button in the bottom corner that opens the chat

##### TitleText
The text that appears in the upper left of the chat container, corresponding to the `TitleText` message

##### ToggleChatButtonIcon
The icon in the `ToggleChatButton`

##### TypingIndicatorSvgStyle
SVG Container of the agent typing indicator

##### TypingIndicatorCircleStyle
Styling for the three SVG circles that appear within the SVG Container of the agent typing indicator

##### WelcomeFormBanner
The banner that is shown above the welcome form

##### WelcomeFormField
A field in the welcome form

##### WelcomeFormFieldInput
The input for single line fields in the welcome form

##### WelcomeFormFieldLabel
The label for fields in the welcome form

##### WelcomeFormFieldTextarea
The textarea for multi-line fields in the welcome form

##### WelcomeFormSubmitButton
The submit button for the welcome form

## SDK

 The `Quiq()` function initializes Webchat, and returns a Quiq object which exposes functions you can use to communicate with Webchat.

  ```javascript
  var chat = Quiq(host: string, contactPoint: string [, options]);
  ```

### The Quiq object

The Quiq object, returned by a call to the `Quiq()` function, exposes methods you can use to interact with the webchat UI and the Quiq webchat service.

#### getChatStatus
  - getChatStatus(callback)
  - Returns a Promise with an object containing a single boolean `active` key. Optionally, a callback can be passed to the function which will be called with the same object.

#### getAgentAvailability
  - getAgentAvailability(callback)
  - Returns a Promise with an object containing a single boolean `available` key. Optionally, a callback can be passed to the function which will be called with the same object.

#### getChatVisibility
  - getChatVisibility(callback)
  - Returns a Promise with an object containing a single boolean `visible` key. Optionally, a callback can be passed to the function which will be called with the same object.

#### getHandle
  - getHandle(callback)
  - Returns a Promise with an object containing a single key, `handle`, corresponding to a unique string id to be used for tracking the session of the current user. Optionally, a callback can be passed to the function which will be called with the same object.

#### on
  - on(eventName: EventType, handler)
  - Using the `on()` function, you can have the SDK call your `handler` function when a given event occurs. `handler` will be called with a single `event` argument. See the table below for supported events and the corresponding fields in the `event` object.

    Event | `event` object fields
    --- | ---
    `agentAvailabilityDidChange` | `available: boolean`
    `chatVisibilityDidChange` | `visible: boolean`

#### setChatVisibility
  - setChatVisibility(visible: boolean)
  - Shows or hides the Chat UI. If `visible` is `true`, the Chat UI will be made visible to the user if it is not already. If `false`, the Chat UI will be hidden.

#### sendRegistration
  - sendRegistration([{id: string, value: string}])
  - Sends the chat user's registration information as an array of data fields (ids and values), as opposed to having them enter it in the Welcome Form. This data will be shown to the agent who is handling the chat conversation.

## Extension SDK

  Custom screens can be defined in the customScreens property on the QuiqObject [customScreens](#customScreens). From within a custom screen, you can interact with the chat application using the Extension SDK. To load the SDK, reference it in a script tag:

  ```
  <script type="text/javascript" src="https://<%hostName%>/app/webchat/extensionSdk.js"></script>
  ```

### on
  - on(eventName: EventType, handler)
  - Using the `on()` function, you can have the SDK call your `handler` function when a given event occurs. `handler` will be called with a single `event` argument. See the table below for supported events and the corresponding fields in the `event` object.

    Event | `event` object fields
    --- | ---
    `estimatedWaitTimeChanged` | `estimatedWaitTime: ?number` (milliseconds - if undefined then no wait time is available)

## Supported Browsers
The following browsers with versions greater than or equal to the following are supported by Quiq WebChat.
* Chrome 43
* Firefox 48.0
* Safari 6.1
* Internet Explorer 10
* Internet Explorer 11
* Microsoft Edge 12
* Most Modern Mobile Devices

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


<!-- DEPRECATED VALUES - Don't document them anymore.
  - COLOR _Deprecated: _Deprecated: You should use styles to set styles._
      - type: string
      - description: Color to control appearance of chat UI in hex format.
      - default: `'#59ad5d'` (green)
      - example: `'#59ad5d'`
  - HEADER_TEXT _Deprecated: You should set MESSAGES.headerText instead_
    - type: string
    - description: Message to appear at top of chat window.
    - default: `"We're here to help if you have any questions!"`
    - example: `"We're here to help if you have any questions!"`
-->
