// @flow

export type ExtensionEvent = {
  eventType: string,
  data: Object,
};

let _extensionWindow: Object;
let _extensionUrl: string;

export const registerExtension = (extensionUrl: string, extensionWindow: Object) => {
  _extensionUrl = extensionUrl;
  _extensionWindow = extensionWindow;
};

export const postExtensionEvent = (event: ExtensionEvent) => {
  if (_extensionWindow) {
    _extensionWindow.postMessage(event, _extensionUrl);
  }
};
