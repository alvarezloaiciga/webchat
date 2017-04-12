# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

## Usage

Just include this at the bottom of the page
```js
  <script type="text/javascript">
    window.QUIQ = {
      HOST: 'https://andrew.dev.centricient.corp',
    };
  </script>
  <script src="https://yourTenant.cluster.centricient.corp/app/webchat" type="text/javascript"></script>
```
replacing HOST with your site URL. Also ensure you have registered the `default` contactPoint with Chatterbox at `POST /external/chat/registration`
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
