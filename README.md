# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

## Usage

Just include this at the bottom of the page
```js
  <script type="text/javascript">
    window.QUIQ = {
      TENANT: {string} Your Tenant Id,
      CONTACT_POINT: {string} The contact point for this webchat interface,
      HOST: {string?}: The hostname to operate against. Default: 'goquiq.com',
      COLOR: {string?}: Optional color to control appearance of chat UI, in hex format. Default: '#59ad5d',
      HEADER_TEXT: {string?}: Optional message to appear at top of chat window. Default: 'We\'re here to help if you have any questions!'
    };
  </script>
  <script src="CDN_JS_SOURCE" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="CDN_CSS_SOURCE">
```
