// @flow
declare var __DEV__: string;
declare var QuiqModernizr: Object;
import 'modernizr';
import messages from 'messages';
import {getDisplayString, formatTime} from 'utils/i18n';
import {SupportedWebchatUrls} from 'appConstants';
import {UAParser} from 'ua-parser-js';
import type {BrowserNames, DeviceTypes, OSNames, IntlMessage} from 'types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

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

export const isIE9 = () => getBrowserName() === 'IE' && getMajor() <= 9;
export const isIE10 = () => getBrowserName() === 'IE' && getMajor() === 10;
export const isMobile = () => getDeviceType() === 'mobile';

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// QuiqModernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore QuiqModernizr in that case
export const supportsFlexbox = () => isIE10() || (QuiqModernizr.flexbox && QuiqModernizr.flexwrap);
export const supportsSVG = () =>
  QuiqModernizr.svg && QuiqModernizr.svgfilters && QuiqModernizr.inlinesvg;

export const displayError = (error: IntlMessage | string, values: {[string]: string} = {}) => {
  throw new Error(
    `\n
!!! ${getDisplayString(messages.quiqFatalError)} !!!
  ${getDisplayString(error, values)}
!!! ${getDisplayString(messages.quiqFatalError)} !!!\n`,
  );
};

export const inStandaloneMode = () => window.location.href.includes('standalone');

export const getWebchatUrlFromScriptTag = () => {
  // eslint-disable-line no-unused-vars
  // Local Development should just always supply HOST manually for simplicity
  // Also catches cases when running standalone built webchat locally
  if (
    __DEV__ ||
    window.location.hostname === 'localhost' ||
    window.location.origin === 'file://' ||
    window.location.hostname === 'mymac'
  ) {
    if (!window.QUIQ || !window.QUIQ.HOST) {
      throw new Error('You must specify window.QUIQ.HOST when running locally!');
    }
    return window.QUIQ.HOST;
  }

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
