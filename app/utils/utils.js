// @flow
declare var Modernizr: Object;
import {UAParser} from 'ua-parser-js';
import type {BrowserNames, DeviceTypes, OSNames} from 'types';

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

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// Modernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore Modernizr in that case
export const supportsFlexbox = () => isIE10() || Modernizr.flexbox;
