# Quiq WebChat [![Build Status](https://travis-ci.org/Quiq/webchat.svg?branch=master)](https://travis-ci.org/Quiq/webchat) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
This is the end-user client for web chats with Quiq Messaging

Some options described in this document may not be deployed yet. For the current version of the documentation, please check [here](https://github.com/Quiq/webchat/blob/1.0.133/README.md)

## Customizing
We provide a way to customize the look and feel of Quiq Webchat to fit your brand's look and feel. You can provide a set of `COLORS` in the `window.QUIQ` configuration object. (See [here](#windowquiq-object) for more details). If you want more control than this, you can also set the `STYLES` property to customize elements in more detail. Information on what all can be customized is listed [here](#setting-styles).

Adding a css file to your page to override the default styles is not supported.  This is because at any time in the future, we may change HTML structure or CSS class names, causing potentially breaking changes on any site containing the modified code.
If there's some other customization you'd like, please open an issue in this repository describing what you'd like to be customizable.

## Usage

### Setup
Ensure you have registered the `default` contactPoint with Chatterbox at `POST /external/chat/registration`
```json
  {
    "endpoints": [
      {
        "id": "default",
        "label": "default"
      }
    ]
  }
```

### Running on a hosted site
Include this at the bottom of your index.html
```html
<script type="text/javascript">
  // Any options should be passed in here
  window.QUIQ = {
    CONTACT_POINT: 'myCustomContactPoint',
  };
</script>
<script src="https://yourTenant.goquiq.com/app/webchat/index.js" type="text/javascript"></script>
```

### Running Locally

First install all dependencies by running `npm install` or `yarn`

Start the dev server with `TENANT='yourTenant' npm start` or `TENANT='yourTenant' yarn start`

The first portion of that command specifies which tenant the webchat should connect to.  For example, if your company's name is 'Foo', you'd type `TENANT='foo' npm start` or `TENANT='foo' yarn start`

You should now be able to go to `localhost:3000` to see a page that's blank except for quiq webchat.

This dev server has hot-reloading enabled, so saving a file in the project should push the changes to your browser without you needing to reload the page.

### Running from a VM locally (e.g for testing IE)
We use Ngrok to expose localhost over a public url.  To use this feature, do the following.
1. `yarn vmstart`
2. Take note of the red text.  It tells you what URL to go to.
3. Go to that URL in your vm.
Note: This process is a bit flimsy, so if the page doesn't load in 10 or so seconds, try refreshing the page.

### window.QUIQ Object
The window.QUIQ object contains properties describing how the instance of webchat should act.  All properties are optional.
  - CONTACT_POINT
    - type: string
    - description: The contact point for this webchat interface
    - default: `'default'`
    - example: `'default'`
  - COLOR _Deprecated: You should set COLORS.primary instead_
    - type: string
    - description: Color to control appearance of chat UI in hex format.
    - default: `'#59ad5d'` (green)
    - example: `'#59ad5d'`
  - COLORS
    - type:
    ```javascript
    {
      primary: string,
      agentMessageText: string, // Text color for messages sent by the support agent
      agentMessageLinkText: string, // Text color for links sent by the support agent
      agentMessageBackground: string, // Message bubble color for links sent by the support agent
      customerMessageText: string, // Text color for messages sent by the end user
      customerMessageLinkText: string, // Text color for links sent by the end user
      customerMessageBackground: string, // Message bubble color for links sent by the end user
      transcriptBackground: string, // Background color for the chat transcript
    }
    ```
    - description: Color values for the webchat
    - defaults:
    ```javascript
    {
      primary: '#59ad5d', quiqOptions
      agentMessageText: '#000',
      agentMessageLinkText: '#2199e8',
      agentMessageBackground: '#fff',
      customerMessageText: '#fff',
      customerMessageLinkText: '#fff',
      customerMessageBackground: COLORS.primary,
      transcriptBackground: '#f4f4f8',
    }
    ```
  - STYLES
    - type: Object
    - description: Options to customize the look and feel of your webchat client. See [here](#setting-styles) for available options
    - default: `{}`
    - example:
    ```javascript
    {
      HeaderBanner: {
        fontSize: 18,
        margin: '8px 4px'
      }
    }
    ```
  - POSITION
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
    {
      bottom: 0,
      right: '20px',
    }
    ```
  - HEADER_TEXT _Deprecated: You should set MESSAGES.headerText instead_
    - type: string
    - description: Message to appear at top of chat window.
    - default: `"We're here to help if you have any questions!"`
    - example: `"We're here to help if you have any questions!"`
  - MESSAGES
    - type:
    ```javascript
    {
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
    }
    ```
    - description: Custom static strings to use in various places throughout the chat client.
    - default:
    ```javascript
    {
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
    }
    ```
  - HOST
    - type: string
    - description: The hostname to operate against. In production, this should always be goquiq.com, and shouldn't need to be manually set
    - default: `'goquiq.com'`
    - example: `'goquiq.com'`
  - MOBILE_NUMBER
    - type: number | string,
    - description: If the user is on a mobile device, chat will not show. Instead, when the user taps on the launch button their SMS app will open with the `to` field set to this value. If `MOBILE_NUMBER` is not defined, that chat launcher button is not visible on mobile devices.
    - default: none
    - examples: `1234567891`, `"+15556667777"`
  - FONT_FAMILY
    - type: string
    - description: Font Family of all text within the webchat.  Can be multiple values, as long as they are valid css values
    - default: `'sans-serif'`
    - example: `'Lato, sans-serif'`
  - WIDTH
    - type: number
    - description: The width (px) of the webchat
    - default: `400`
    - example: `400`
  - HEIGHT
    - type: number
    - description: The max height (px) of the webchat
    - default: `600`
    - example: `600`
  - AUTO_POP_TIME
    - type: number
    - description: Number, in milliseconds, until the webchat automatically pops open on its own. Leave undefined to disable.
    - default: `undefined`
    - example: `2000`
  - CUSTOM_LAUNCH_BUTTONS
    - type: Array<string>
    - description: List of [selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Simple_selectors) pointing at elements that exist on page load that should act as a launcher for chat. The `noAgentsAvailable` class will be added to the element when no agents are available and removed once an agent becomes available. If the `CUSTOM_LAUNCH_BUTTONS` array is populated, the default launcher button is removed.  Note that it is important that the selectors be unique as the first occurence of the selector will be used as the launcher.
    - default: `[]`
    - example: `['.customButtonClass1', '#customButtonId2']`
  - WELCOME_FORM
    - type:
    ```javascript
    {
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
      {
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

### Setting Styles
Values passed into the `STYLES` property of the `window.QUIQ` object will be applied to the elements using inline styles. Properties are named the same as in CSS, except that they are camelCased. For example:
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

`HeaderMenu`: The top section of the chat container that contains the minimize, maximize, and close icons

`HeaderMenuIcons`: The icons inside `HeaderMenu`

`HeaderBanner`: The banner that is shown above the chat transcript

`ErrorBanner`: The banner that is shown when there is a connection error

`ToggleChatButton`: The button in the bottom corner that opens the chat

`ToggleChatButtonIcon`: The icon in the `ToggleChatButton`

`CustomerMessageBubble`: The message bubble for messages that the customer sent

`CustomerMessageText`: The text for messages that the customer sent

`CustomerAvatar`: The avatar that shows up for the customer. (By default there is nothing here)

`AgentMessageBubble`: The message bubble for messages that the support agent sent

`AgentMessageText`: The text for messages that the support agent sent

`AgentAvatar`: The avatar that shows up for the support agent. (By default there is nothing here)

`MessageForm`: The form at the bottom of the chat that holds the text box and send button

`MessageFormInput`: The text box for sending messages

`MessageFormSend`: The send button for the chat

`WelcomeFormBanner`: The banner that is shown above the welcome form

`WelcomeFormField`: A field in the welcome form

`WelcomeFormFieldLabel`: The label for fields in the welcome form

`WelcomeFormFieldInput`: The input for single line fields in the welcome form

`WelcomeFormFieldTextarea`: The textarea for multi-line fields in the welcome form

`WelcomeFormSubmitButton`: The submit button for the welcome form

### Production Note
If running Webchat in IE9, it is _required_ to have the following at the **top** of your webpage's `<head>`.

`<meta http-equiv="X-UA-Compatible" content="IE=edge">`

### isIE9

Things IE9 doesn't support.
- Flexbox
- Websockets
- LocalStorage
