# Welcome to Quiq.js

Quiq.js is a high-level SDK for utilizing Quiq Webchat on your website or application.
It allows you to integrate our prebuilt user interface with varying degrees of customization. Depending on your needs, integration can require as little as two lines of code.

!!! note "Note for existing users"
    If you are currently using a legacy version of Quiq Webchat without the SDK (i.e., you use the `window.QUIQ` object for setup and customization)
    the SDK is backwards compatible with your existing pages. Things will work out of the box with no changes to your page. 
    **Note that if the `window.QUIQ` object is defined on a given page (prior to including a `script` tag for webchat), you will not have access to the `Quiq()` function. 
    Webchat will configure itself automatically based on the options you provided in `window.QUIQ`.**
    To take advantage of the useful features offered by the SDK we encourage you to follow the Quiqstart guide below to migrate.

## Quiq Start

To get started with the standard Webchat setup, include `quiq.js` on your page by adding the following script tag into the `<head>` of your HTML:
(Replace `<tenant>` with the name of your Quiq tenant.)

```javascript
<script src="https://<tenant>.goquiq.com/app/webchat/index.js" />
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
var chat = Quiq(host: string, contactPoint: string [, options]);
```

# The Quiq object

The Quiq object, returned by a call to the `Quiq()` function, exposes methods you can use to interact with the webchat UI and the Quiq webchat service.

#### `setChatVisibility(visible: boolean)`

Shows or hides the Chat UI. If `visible` is `true`, the Chat UI will be made visible to the user if it is not already. If `false`, the Chat UI will be hidden.

#### `getChatVisibility(callback)`

Returns a Promise with an object containing a single boolean `visible` key.
Optionally, a callback can be passed to the function which will be called with the same object.

#### `getAgentAvailability(callback)`

Returns a Promise with an object containing a single boolean `available` key.
Optionally, a callback can be passed to the function which will be called with the same object.

#### `on(eventName: EventType, handler)`

Using the `on()` function, you can have the SDK call your `handler` function when a given event occurs.
`handler` will be called with a single `event` argument. See the table below for supported events and the corresponding fields in the `event` object.

Event | `event` object fields 
--- | --- 
`agentAvailabilityDidChange` | `available: boolean`
`chatVisibilityDidChange` | `visible: boolean`