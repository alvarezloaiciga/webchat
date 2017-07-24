// @flow
declare var __DEV__: string;
declare var Modernizr: Object;
import 'modernizr';
import messages from 'messages';
import {getDisplayString} from 'utils/i18n';
import {SupportedWebchatUrls} from 'appConstants';
import {UAParser} from 'ua-parser-js';
import qs from 'qs';
import type {BrowserNames, DeviceTypes, OSNames, IntlMessage} from 'types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const getMajor = (): number => parseInt(parser.getResult().browser.major, 10);

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();

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

export const isIEorSafari = () => getBrowserName() === 'IE' || getBrowserName() === 'Safari';

export const isMobile = () => getDeviceType() === 'mobile';

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// Modernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore Modernizr in that case
export const supportsFlexbox = () => isIE10() || (Modernizr.flexbox && Modernizr.flexwrap);
export const supportsSVG = () => Modernizr.svg && Modernizr.svgfilters && Modernizr.inlinesvg;

export const displayError = (error: IntlMessage | string, values: {[string]: string} = {}) => {
  throw new Error(
    `\n
!!! ${getDisplayString(messages.quiqFatalError)} !!!
  ${getDisplayString(error, values)}
!!! ${getDisplayString(messages.quiqFatalError)} !!!\n`,
  );
};

export const inStandaloneMode = () => window.location.href.includes('standalone');

export const getCleansedLocation = () => {
  if (!inStandaloneMode()) return window.location.href;

  const host = window.location.href.split('?')[0];
  const queryString = qs.parse(window.location.href.split('?')[1]);
  if (!queryString || !queryString.QUIQ) return window.location.href;

  delete queryString.QUIQ;

  if (Object.keys(queryString).length === 0) return host;

  return `${host}?${qs.stringify(queryString)}`;
};

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
