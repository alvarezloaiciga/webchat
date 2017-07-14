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
    name: 'Mac OS',
    version: 10,
  },
  device: {
    model: 'iPad',
    vendor: 'Apple',
    type: 'tablet',
  },
  cpu: {
    architecture: 'amd64',
  },
  engine: {
    name: 'WebKit',
    version: 537.36,
  },
  navigator:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36',
});
export const compatibilityMode = () => false;
export const isIE9 = () => false;
export const isIE10 = () => false;
export const nonCompatibleBrowser = () => false;
export const supportsFlexbox = () => true;
export const supportsSVG = () => true;
export const displayError = (error: string) => error;
export const isIEorSafari = () => false;
