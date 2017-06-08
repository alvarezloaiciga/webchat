# Quiq WebChat [![Build Status](https://travis-ci.org/Quiq/webchat.svg?branch=master)](https://travis-ci.org/Quiq/webchat)

This is the end-user client for web chats with Quiq Messaging

## Customizing
While technically all css within the Chat Widget is overridable, it is strongly discouraged and not supported.  This is because at any time in the future, we may change HTML structure or CSS class names, causing potentially breaking changes on any site containing the modified code.  We provide some color overrides as well as custom messaging within the fields described above.  

If there's some other customization you'd like, please open an issue in this repository describing what you'd like to be customizable. If you require further customization, you can fork this repository, keeping in mind you will need to maintain your fork after that point.

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

Update `window.QUIQ` object in index.html to point to your site and contact point, as well as any other overrides you want to use
A list of all possible overrides are listed in `__mocks__/quiq.js`
```html
<script type="text/javascript">
  window.QUIQ = {
    HOST: 'https://andrew.dev.quiq.sh',
  };
</script>
```
replacing HOST with your site URL.

There is an optional `DEBUG` property on the window.QUIQ object.  Currently this will override the atmosphere transport type.
```js
window.QUIQ = {
  HOST: 'https://andrew.dev.centricient.corp',
  DEBUG: {
    transport: 'long-polling'
  }
};
```

Start the dev server with `npm start` or `yarn start`

You should now be able to go to `localhost:3000` to see a page that's blank except for quiq webchat.

This dev server has hot-reloading enabled, so saving a file in the project should push the changes to your browser without you needing to reload the page.

### Running from a VM locally (e.g for testing IE)
We use Ngrok to expose localhost over a public url.  To use this feature, do the following.
1. `yarn vmstart`
2. Take note of the red text.  It tells you what URL to go to.
3. Go to that URL in your vm.
Note: This process is a bit flimsy, so if the page doesn't load in 10 or so seconds, try refreshing the page.

### window.QUIQ Object
The window.QUIQ object contains properties describing how the instance of webchat should act.  
  - CONTACT_POINT
    - type: string
    - description: The contact point for this webchat interface
    - required: no
    - default: 'default'
  - COLOR
    - type: string
    - description: Color to control appearance of chat UI in hex format.
    - required: no
    - default: '#59ad5d' (green)
  - HEADER_TEXT
    - type: string
    - description: Message to appear at top of chat window.
    - required: no
    - default: 'We're here to help if you have any questions!'
  - HOST
    - type: string
    - description: The hostname to operate against. In production, this should always be goquiq.com, and shouldn't need to be manually set
    - required: no
    - default: 'goquiq.com'

### Production Note
If running Webchat in IE9, it is _required_ to have the following at the **top** of your webpage's `<head>`.

`<meta http-equiv="X-UA-Compatible" content="IE=edge">`

### isIE9

Things IE9 doesn't support.
- Flexbox
- Websockets
- LocalStorage
