# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

This app will be hosted and included in an iframe in our clients' sites. When the iframe loads it
will expect a message to be posted providing the following parameters:

``` js
const params = {
      contactPoint: {string} The endpoint for this webchat interface,
      tenant: {string} Your tenant ID,
      host: {string} The hostname to operate against, such as 'dev.centricient.corp',
      color: {string?} Optional color to control appearance of chat UI, in hex format. Default: '#59ad5d',
      headerText: {string?} Optional message to appear at top of chat window. Default: 'We're here to help if you have any questions!'
}
```

``` js
iframeWindow.postMessage(params, URL_FOR_WHERE_THIS_APP_IS_HOSTED);
```
