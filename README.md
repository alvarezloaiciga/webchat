# Quiq WebChat [![Build Status](https://travis-ci.org/Quiq/webchat.svg?branch=master)](https://travis-ci.org/Quiq/webchat) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
This is the end-user client for web chats with Quiq Messaging

## Customizing
While technically all css within the Chat Widget is overridable, it is strongly discouraged and not supported.  This is because at any time in the future, we may change HTML structure or CSS class names, causing potentially breaking changes on any site containing the modified code.  We provide some color overrides as well as custom messaging within the fields described above.  

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
      primary: '#59ad5d', // (Falls back to `QUIQ.COLOR`)
      agentMessageText: '#000',
      agentMessageLinkText: '#2199e8',
      agentMessageBackground: '#fff',
      customerMessageText: '#fff',
      customerMessageLinkText: '#fff',
      customerMessageBackground: COLORS.primary,
      transcriptBackground: '#f4f4f8',
    }
    ```

  - MESSAGES
    - type: 
    ```javascript
    {
            HEADER_TEXT: string,
            SEND_BUTTON_LABEL: string,
            MESSAGE_FIELD_PLACEHOLDER: string,
            WELCOME_FORM_VALIDATION_ERROR_MESSAGE: string,
            WELCOME_FORM_SUBMIT_BUTTON_LABEL: string,
            WELCOME_FORM_SUBMITTING_BUTTON_LABEL: string,
            AGENT_TYPING_MESSAGE: string,
            CONNECTING_MESSAGE: string,
            RECONNECTING_MESSAGE: string,
            ERROR_MESSAGE: string,
            REQUIRED_FIELD_ARIA_LABEL: string,
            MINIMIZE_WINDOW_TOOLTIP: string,
            DOCK_WINDOW_TOOLTIP: string,
            OPEN_IN_NEW_WINDOW_TOOLTIP: string,
            CLOSE_WINDOW_TOOLTIP: string,
    }
    ```
    - description: Custom static strings to use in various places throughout the chat client.
    - default: 
    ```javascript
    {
            HEADER_TEXT: 'We\'re here to help if you have any questions!',
            SEND_BUTTON_LABEL: 'Send',
            MESSAGE_FIELD_PLACEHOLDER: 'Send us a message...',
            WELCOME_FORM_VALIDATION_ERROR_MESSAGE: 'Please complete all fields marked with an *',
            WELCOME_FORM_SUBMIT_BUTTON_LABEL: 'Submit',
            WELCOME_FORM_SUBMITTING_BUTTON_LABEL: 'Submitting',
            AGENT_TYPING_MESSAGE: 'Agent is typing',
            CONNECTING_MESSAGE: 'Connecting...',
            RECONNECTING_MESSAGE: 'Reconnecting...',
            ERROR_MESSAGE: 'We\'re having trouble connecting. Try refreshing the page.',
            REQUIRED_FIELD_ARIA_LABEL: 'Required',
            MINIMIZE_WINDOW_TOOLTIP: 'Minimize window',
            DOCK_WINDOW_TOOLTIP: 'Dock chat',
            OPEN_IN_NEW_WINDOW_TOOLTIP: 'Open chat in new window',
            CLOSE_WINDOW_TOOLTIP: 'Close window',
    }
   
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
          rows: boolean, // Only applicable if type is textarea
        },
      ]
    }
    ```
    - description: Object describing a web form that should display to new users before they are connected with an agent. Leave undefined to disable. If fields with and an `id` of `firstName` and `lastName` are defined, Quiq will use the values of these form fields to set the first and last name of the customer within the Agent UI.
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
          }
        ]
      }
    ```

### Production Note
If running Webchat in IE9, it is _required_ to have the following at the **top** of your webpage's `<head>`.

`<meta http-equiv="X-UA-Compatible" content="IE=edge">`

### isIE9

Things IE9 doesn't support.
- Flexbox
- Websockets
- LocalStorage
