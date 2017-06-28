# Quiq WebChat [![Build Status](https://travis-ci.org/Quiq/webchat.svg?branch=master)](https://travis-ci.org/Quiq/webchat)

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
  - COLOR
    - type: string
    - description: Color to control appearance of chat UI in hex format.
    - default: `'#59ad5d'` (green)
    - example: `'#59ad5d'`
  - HEADER_TEXT
    - type: string
    - description: Message to appear at top of chat window.
    - default: `"We're here to help if you have any questions!"`
    - example: `"We're here to help if you have any questions!"`
  - HOST
    - type: string
    - description: The hostname to operate against. In production, this should always be goquiq.com, and shouldn't need to be manually set
    - default: `'goquiq.com'`
    - example: `'goquiq.com'`
  - FONT_FAMILY
    - type: string
    - description: Font Family of all text within the webchat.  Can be multiple values, as long as they are valid css values
    - default: `'sans-serif'`
    - example: `'Lato, sans-serif'`
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
    - type: JSON
    - description: Object describing a web form that should display to new users before they are connected with an agent. Leave undefined to disable
    - default: `undefined`
    - example:
    ```js
      {
        headerText:
          'Thanks for contacting us! Please fill out a couple brief pieces of information and we will get you chatting with an agent.',
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