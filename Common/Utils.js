// @flow
declare var __DEV__: string;
declare var QuiqModernizr: Object;

import messages from 'Common/Messages';
import {SupportedWebchatUrls, localStorageKeys, unknownErrorMessage} from './Constants';
import {UAParser} from 'ua-parser-js';
import './modernizr';
import type {BrowserNames, DeviceTypes, OSNames, BrowserEngine, IntlMessage} from './types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const getEngineName = (): BrowserEngine => parser.getResult().engine.name;

export const getEngineVersion = (): number => parseInt(parser.getResult().engine.version, 10);

export const getMajor = (): number => parseInt(parser.getResult().browser.major, 10);

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();

export const isMobile = () => !!getDeviceType();

export const isSupportedBrowser = () => {
  if (isMobile()) return true;

  const name = getBrowserName();
  const major = getMajor();

  if (name === 'Chrome' && major >= 43) return true;
  if (name === 'Firefox' && major >= 48) return true;
  if (name === 'Safari' && major >= 6.1) return true;
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

export const isIE9 = () => getBrowserName() === 'IE' && getMajor() <= 9;
export const isIE10 = () => getBrowserName() === 'IE' && getMajor() === 10;

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// QuiqModernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore QuiqModernizr in that case
export const supportsFlexbox = () => isIE10() || (QuiqModernizr.flexbox && QuiqModernizr.flexwrap);
export const supportsSVG = () =>
QuiqModernizr.svg && QuiqModernizr.svgfilters && QuiqModernizr.inlinesvg;

export const displayError = (error: string | IntlMessage, values: { [string]: string } = {}) => {
  const message = typeof error === 'string' ? error : (error.defaultMessage || unknownErrorMessage);
  throw new Error(buildTemplateString(message, values));
};

export const displayWarning = (error: string, values: { [string]: string } = {}) => {
  console.warn(buildTemplateString(error, values));
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
export const getQuiqKeysFromLocalStorage = (contactPoint: ?string, postfix: ?string): { [string]: any } => {
  try {
    if (!localStorage) return {};
    const ls = {};
    const cpPostfix = contactPoint ? `_${contactPoint}` : '';
    const allKeys = localStorageKeys.flatMap(k => [
      `${k}${cpPostfix}`,
      `__storejs_expire_mixin_${k}${cpPostfix}`,
      `__storejs_modified_timestamp_mixin_${k}${cpPostfix}`
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

export const setLocalStorageItemsIfNewer = (data: { [string]: any }) => {
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
export const buildTemplateString = (s: string, values: { [string]: any }): string => {
  return s.replace(/{(\w*)}/g, (m: string, key: string) => {
    return values.hasOwnProperty(key) ? values[key].toString() : '';
  });
};
