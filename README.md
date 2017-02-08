# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

This app will be hosted and included in an iframe in our clients' sites. When the iframe loads it
will expect a message to be posted to tell it what tenant it is.

``` js
iframeWindow.postMessage({tenant: QUIQ_TENANT}, URL_FOR_WHERE_THIS_APP_IS_HOSTED);
```
