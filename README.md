# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

### Production Note
If running Webchat in IE9, it is _required_ to have the following at the **top** of your webpage's `<head>`.

`<meta http-equiv="X-UA-Compatible" content="IE=edge">`

### isIE9

Things IE9 doesn't support.
- Flexbox
- Websockets
- LocalStorage

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
```js
<script src="https://yourTenant.cluster.centricient.corp/app/webchat/index.js" type="text/javascript"></script>
```

### Running Locally
Include this at the bottom of the page
```js
  <script type="text/javascript">
    window.QUIQ = {
      HOST: 'https://andrew.dev.centricient.corp',
    };
  </script>
  <script src="/location/of/index.js" type="text/javascript"></script>
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
