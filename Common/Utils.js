// @flow
declare var __DEV__: string;
declare var QuiqModernizr: Object;

import messages from 'messages';
import {SupportedWebchatUrls} from './Constants';
import {UAParser} from 'ua-parser-js';
import {getDisplayString, formatTime} from './i18n';
import './modernizr';
import type {BrowserNames, DeviceTypes, OSNames, BrowserEngine} from './types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const getEngine = (): BrowserEngine => parser.getResult().engine.name;

export const getMajor = (): number => parseInt(parser.getResult().browser.major, 10);

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();

/**
 * @param {number} timestamp - timestamp to format
 * @return {String} - plain-text formatted date in the format of MM/DD/YY, HH:MM:SS AM/PM
 */
export const getFormattedDateAndTime = (timestamp: number): string =>
  formatTime(timestamp, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

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

export const isMobile = () => getDeviceType() === 'mobile';

export const getCalcStyle = (val1: number | string, val2: number | string, operand: string) => {
  const expression = `calc(${val1} ${operand} ${val2})`;
  switch (getEngine()) {
    case 'WebKit':
      return `-webkit-${expression}`;
    case 'Gecko':
      return `-moz-${expression}`;
    default:
      return expression;
  }
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

export const isIFrame = (chatWindow): boolean => {
  return chatWindow instanceof HTMLElement && chatWindow.tagName.toLowerCase() === 'iframe';
};

export const camelizeToplevelScreamingSnakeCaseKeys = (obj: Object) => {
  const newObject = {};
  Object.keys(obj).forEach(key => {
    const newKey = camelize(key.toLowerCase());
    newObject[newKey] = obj[key];
  });
  return newObject;
};

export const getHostingWindow = () => {
  return window.opener || window.parent;
  // If window.opener is defined, then we're in a popup.
  // Because we are on same domain as the iframe that opened us, we can retrieve iframe's parent, which is the hosting window
  if (window.opener && window.opener.parent && window.opener.parent !== window.opener)
    return window.opener.parent;

  // If window.opener is not defined, then we're in iframe
  // If window.parent is not a reference to ourselves, then we're in an iframe.
  if (window.parent && window.parent !== window) return window.parent;

  displayError({
    id: 'cannotFindHostingWindow',
    description: 'Message displayed when frame or window containing webchat app cannot be found in DOM',
    defaultMessage: 'Unable to find iframe or window containing webchat',
  });
};

export const isIE9 = () => getBrowserName() === 'IE' && getMajor() <= 9;
export const isIE10 = () => getBrowserName() === 'IE' && getMajor() === 10;

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// QuiqModernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore QuiqModernizr in that case
export const supportsFlexbox = () => isIE10() || (QuiqModernizr.flexbox && QuiqModernizr.flexwrap);
export const supportsSVG = () =>
  QuiqModernizr.svg && QuiqModernizr.svgfilters && QuiqModernizr.inlinesvg;

export const displayError = (error: IntlMessage | string, values: {[string]: string} = {}) => {
  throw new Error(getDisplayString(error, values));
};

export const displayWarning = (error: IntlMessage | string, values: {[string]: string} = {}) => {
  console.warn(getDisplayString(error, values));
};

// If window.opener is not null, then we're in a popup.
export const inStandaloneMode = () => !!window.opener;

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
  str
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (ltr, idx) => (idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()),
    )
    .replace(/\s+/g, '');

export const inNonProductionCluster = () =>
  !!window.location.hostname.match(
    /.*[.-](dev|qa|perf)\.(centricient\.corp|quiq\.sh|goquiq\.com)/g,
  );

export const inLocalDevelopment = () =>
  __DEV__ || !!window.location.hostname.match(/.*\.(centricient|quiq)\.dev/g);