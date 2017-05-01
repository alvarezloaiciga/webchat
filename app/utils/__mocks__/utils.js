export const getBrowserName = () => 'Chrome';
export const getMajor = () => 60;
export const getDeviceType = () => 'PC';
export const getOSName = () => 'Windows';
export const getUAInfo = () => ({
  browser: {
    name: 'Chrome',
    major: 60,
  },
  os: {
    name: 'Windows',
    version: 7,
  },
});
export const compatibilityMode = () => false;
export const isIE9 = () => false;
export const isIE10 = () => false;
export const nonCompatibleBrowser = () => false;
export const supportsFlexbox = () => true;
export const supportsSVG = () => true;
