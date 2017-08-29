# Welcome to Quiq.js

Quiq.js is a high-level SDK for utilizing Quiq Webchat on your website or application.
It allows you to integrate our prebuilt user interface with varying degrees of customization. Depending on your needs, integration can require as little as two lines of code.

## Quiq Start

To get started with the standard Webchat setup, include `quiq.js` on your page by adding the following script tag into the `<head>` of your HTML:

```javascript
<script src="fdsv" />
```
Next, setup Webchat by calling the `Quiq()` function:

```javascript
var chat = Quiq('https://tenant.goquiq.com', 'default');
```
You should replace `tenant` with your own tenant handle. If you would like Webchat to send messages to a specific Contact Point, replace `default` with Contact Point's name.

**That's it!** A launch button should now be visible in the lower-right corner of your page, and a fully functioning chat UI will appear when clicked.

Read on to learn how to style the UI to match your brand, listen for webchat events, add custom launch buttons and more.

# The Quiq() function

 The `Quiq()` function initializes Webchat, and returns a Quiq object which exposes functions you can use to communicate with Webchat.

```javascript
var chat = Quiq(host: string, contactPoint: string, [options]);
```

# The Quiq object

The Quiq object, returned by a call to the `Quiq()` function, exposes methods you can use to interact with the webchat UI and the Quiq webchat service.

## `setChatVisibility(visible: boolean)`

Shows or hides the Chat UI. If `visible` is `true`, the Chat UI will be made visible to the user if it is not already. If `false`, the Chat UI will be hidden.

## `toggleChatVisibility()`

Has the same effect as the user clicking on the launch button. If the Chat UI is currently visible, it will be hidden, and vis versa.
