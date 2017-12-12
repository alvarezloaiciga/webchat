// @flow
declare var __DEV__: string;
declare var QuiqModernizr: Object;

import messages from 'Common/Messages';
import {getDisplayString} from 'core-ui/services/i18nService';
import {SupportedWebchatUrls, localStorageKeys} from './Constants';
import {UAParser} from 'ua-parser-js';
import flatMap from 'lodash/flatMap';
import './modernizr';
import type {
  BrowserNames,
  DeviceTypes,
  OSNames,
  BrowserEngine,
  IntlMessage,
  Message,
} from './types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const isIPhone = (): boolean => parser.getResult().device.model === 'iPhone';

export const getEngineName = (): BrowserEngine => parser.getResult().engine.name;

export const getEngineVersion = (): number => parseInt(parser.getResult().engine.version, 10);

export const getMajor = (): number => parseInt(parser.getResult().browser.major, 10);

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();

export const isMobile = () => !!getDeviceType();

export const isSupportedBrowser = () => {
  const name = getBrowserName();
  const major = getMajor();

  if (name === 'Chrome' && major >= 43) return true;
  if (name === 'Firefox' && major >= 48) return true;
  if (['Safari', 'Mobile Safari'].includes(name) && major >= 6.1) return true;
  if (name === 'Edge' && major >= 12) return true;
  if (name === 'IE' && major >= 10) return true;
  if (name === 'Opera' && major >= 13) return true;

  return false;
};

let storageEnabled;
export const isStorageEnabled = () => {
  if (typeof storageEnabled !== 'undefined') return storageEnabled;

  const storageKey = 'quiq-webchat-storage-test';
  const storageVal = 'enabled?';
  try {
    localStorage.setItem(storageKey, storageVal);
    if (localStorage.getItem(storageKey) !== storageVal) {
      storageEnabled = false;
    }
    localStorage.removeItem(storageKey);
    storageEnabled = true;
  } catch (e) {
    storageEnabled = false;
  }

  return storageEnabled;
};

export const compatibilityMode = () => {
  const compatList = [
    {
      name: 'IE',
      major: 10,
    },
  ];
  const {name, major} = parser.getResult().browser;
  return !!compatList.find(i => i.name === name && parseInt(major, 10) <= i.major);
};

export const convertToExtensionMessages = (transcript: Array<Message>): Array<any> => {
  const extensionMessages = [];

  if (transcript && transcript.length) {
    transcript.forEach(message => {
      if (message.type === 'Text') {
        extensionMessages.push({
          authorType: message.authorType,
          text: message.text,
          id: message.id,
          timestamp: message.timestamp,
          type: 'Text',
        });
      } else if (message.type === 'Attachment') {
        extensionMessages.push({
          authorType: message.authorType,
          type: 'Attachment',
          url: message.url,
          contentType: message.contentType,
          id: message.id,
          timestamp: message.timestamp,
        });
      }
    });
  }

  return extensionMessages;
};

export const getWebchatHostFromScriptTag = () => {
  // Determine host from the script tag that loaded webchat
  const scriptTags = Array.from(document.getElementsByTagName('script'));

  const mainScript = scriptTags.find(
    tag => tag.src && SupportedWebchatUrls.find(u => tag.src.toLowerCase().includes(u)),
  );

  if (!mainScript)
    return displayError('Unable to locate Quiq script tag for determining chat host.');

  const webchatUrl = mainScript.src;
  return webchatUrl.slice(0, webchatUrl.indexOf('/app/webchat'));
};

export const getWindowDomain = () => `${window.location.protocol}//${window.location.host}`;

export const isIFrame = (chatWindow: Object): boolean => {
  return chatWindow instanceof HTMLIFrameElement;
};

export const camelizeToplevelScreamingSnakeCaseKeys = (obj: Object) => {
  const newObject = {};
  Object.keys(obj).forEach(key => {
    const newKey = camelize(key.toLowerCase());
    newObject[newKey] = obj[key];
  });
  return newObject;
};

export const getHostingWindow = (): ?Object => {
  const parent = window.parent !== window.self ? window.parent : null;
  return window.opener || parent;
};

export const getHostingDomain = (): string => {
  const a = document.createElement('a');
  a.href = document.referrer;
  return a.hostname;
};

export const isIE9 = () => getBrowserName() === 'IE' && getMajor() <= 9;
export const isIE10 = () => getBrowserName() === 'IE' && getMajor() === 10;

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// QuiqModernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore QuiqModernizr in that case
export const supportsFlexbox = () => isIE10() || (QuiqModernizr.flexbox && QuiqModernizr.flexwrap);
export const supportsSVG = () =>
  QuiqModernizr.svg && QuiqModernizr.svgfilters && QuiqModernizr.inlinesvg;

export const displayError = (error: string | IntlMessage, values: {[string]: string} = {}) => {
  throw new Error(getDisplayString(error, values));
};

export const displayWarning = (error: string | IntlMessage, values: {[string]: string} = {}) => {
  console.warn(getDisplayString(error, values)); // eslint-disable-line no-console
};

// If window.opener is not null, then we're in a popup.
export const inStandaloneMode = () => {
  // If this fails, it's because of a cross origin exception.
  // This means we  must be in an iFrame, since window and window.top are on different domains.
  // Thus, return false in the catch block.
  try {
    return window.self === window.top;
  } catch (e) {
    return false;
  }
};

export const isLastMessageFromAgent = (transcript: Array<Message>): boolean => {
  return transcript.length > 0 && transcript[transcript.length - 1].authorType === 'User';
};

// Taken from http://emailregex.com/ - RFC-5322 compliant. 99.99% accurate
export const isValidEmail = (email: string) =>
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email,
  );

export const getWebchatUrlFromScriptTag = () => {
  // Determine host from the script tag that loaded webchat
  const scriptTags = Array.from(document.getElementsByTagName('script'));

  const mainScript = scriptTags.find(
    tag => tag.src && SupportedWebchatUrls.find(u => tag.src.toLowerCase().includes(u)),
  );

  if (!mainScript) return displayError(messages.cannotFindScript);

  return mainScript.src;
};

export const camelize = (str: string) =>
  // First, lowercase all uppercase characters not adjacent to a lowercase character
  str
    .replace(/[A-Z]{2,}|^[A-Z]|[A-Z]$/g, a => a.toLowerCase())
    // Then remove symbols and uppercase starts of words
    .replace(/[_\- ]+([^_\- ])/g, (a, b) => b.toUpperCase());

export const inNonProductionCluster = () =>
  !!window.location.hostname.match(
    /.*[.-](dev|qa|perf)\.(centricient\.corp|quiq\.sh|goquiq\.com)/g,
  );

export const inLocalDevelopment = () =>
  __DEV__ || !!window.location.hostname.match(/.*\.(centricient|quiq)\.dev/g);

/**
 * Retrieves all Quiq-related keys, including store.js metadata keys, from local storage.
 * @param contactPoint {string} - If defined, will search for keys within this CP namespace.
 * If undefined, will search for legacy, non-namespaced keys.
 * @param postfix {string} - If defined, will append this contact point as a namespace
 * to the end of each key in the return object.
 * Useful if we need to lookup non-namespaced keys, but want the returned object to be namespaced by contact point.
 * @returns {{}} - A map of local storage keys onto values.
 */
export const getQuiqKeysFromLocalStorage = (
  contactPoint: ?string,
  postfix: ?string,
): {[string]: any} => {
  try {
    if (!localStorage) return {};
    const ls = {};
    const cpPostfix = contactPoint ? `_${contactPoint}` : '';
    const allKeys = flatMap(localStorageKeys, k => [
      `${k}${cpPostfix}`,
      `__storejs_expire_mixin_${k}${cpPostfix}`,
      `__storejs_modified_timestamp_mixin_${k}${cpPostfix}`,
    ]);

    allKeys.forEach(k => {
      const value = localStorage.getItem(k);
      if (value) {
        // If we a postfix is defined, add it to the key before we update the returned object.
        const modifiedKey = `${k}${postfix ? `_${postfix}` : ''}`;
        ls[modifiedKey] = value;
      }
    });

    return ls;
  } catch (e) {
    return {}; // localStorage Disabled. Pass it through until we can display
  }
};

export const setLocalStorageItemsIfNewer = (data: {[string]: any}) => {
  if (!localStorage) return;

  Object.keys(data).forEach(k => {
    // Ignore storejs metadata keys
    if (k.startsWith('__')) return;
    const newModifiedTime = data[`__storejs_modified_timestamp_mixin_${k}`] || 0;
    const existingModifiedTime = parseInt(
      localStorage.getItem(`__storejs_modified_timestamp_mixin_${k}`) || 0,
      10,
    );

    // Write a key to localStorage only if 1) the key does not currently exist or 2) the existing key was modified earlier than the new key
    if (!localStorage.getItem(k) || newModifiedTime > existingModifiedTime) {
      // Write key itself, plus storejs metadata keys
      localStorage.setItem(k, data[k]);
      if (data[`__storejs_modified_timestamp_mixin_${k}`]) {
        localStorage.setItem(
          `__storejs_modified_timestamp_mixin_${k}`,
          data[`__storejs_modified_timestamp_mixin_${k}`],
        );
      }
      if (data[`__storejs_expire_mixin_${k}`]) {
        localStorage.setItem(`__storejs_expire_mixin_${k}`, data[`__storejs_expire_mixin_${k}`]);
      }
    }
  });
};

export const clearQuiqKeysFromLocalStorage = () => {
  try {
    if (!localStorage) return;

    localStorageKeys.forEach(k => {
      localStorage.removeItem(k);
    });
  } catch (e) {} // eslint-disable-line no-empty
};

// From https://stackoverflow.com/questions/377961/efficient-javascript-string-replacement
export const buildTemplateString = (s: string, values: {[string]: any}): string => {
  return s.replace(/{(\w*)}/g, (m: string, key: string) => {
    return values.hasOwnProperty(key) ? values[key].toString() : '';
  });
};

// From https://stackoverflow.com/a/2117523/3961837
// Note that this is not cryptographically random--only use for creating temporary IDs
export const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/**
 * A mimic of Scala's Option[T].getOrElse function. If the left side is defined, even if it's falsy,
 * it returns that value. Otherwise, the right side is returned.
 */
export const getOrElse = <A, B>(a: A, b: B): A | B => (typeof a !== 'undefined' ? a : b);

export const domainIsAllowed = (domain: string, whitelistString: string): boolean => {
  // Domains which include goquiq.com are always allowed (so that chat editor works in admin UI)
  if (domain.includes('goquiq.com')) {
    return true;
  }

  // If whitelist is empty, all domains are allowed
  if (whitelistString.length === 0) {
    return true;
  }

  const whitelist = whitelistString.split(',');

  // Otherwise, try and find a match
  return whitelist.some(d => domain === d.trim());
};
