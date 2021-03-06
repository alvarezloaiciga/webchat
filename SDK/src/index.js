// @flow
/** @jsx h */
import 'babel-polyfill';
import {
  camelizeToplevelScreamingSnakeCaseKeys,
  clearQuiqKeysFromLocalStorage,
  isStorageEnabled,
  isSupportedBrowser,
} from 'Common/Utils';
import {render, h} from 'preact';
import {buildQuiqObject} from 'Common/QuiqOptions';
import NonChat from './components/NonChat';
import SDKLauncher from './components/SDKLauncher';
import {bindLaunchButtons} from 'managers/ButtonManager';
import {setQuiqOptions, getQuiqOptions} from './Globals';
import SDKPrototype from './SdkPrototype';
import {quiqContainerId} from 'Common/Constants';
import {init as notificationServiceInit} from 'services/notificationService';

// Flag indicating whether or not chat has been bootstrapped
let initialized = false;

const constructLauncher = () => {
  notificationServiceInit();
  const unsupported = !isStorageEnabled() || !isSupportedBrowser();
  const options = getQuiqOptions();

  // We will add the unsupported classes to their custom launchers.
  // There's nothing for us to render.
  if (unsupported && options.customLaunchButtons.length > 0) return;

  let anchorElement = null;
  if (options.anchorElement && options.anchorElement !== '') {
    anchorElement = document.querySelector(options.anchorElement);
  } else {
    const root = document.createElement('div');
    root.id = quiqContainerId; // If for some reason you change this, make sure you update the webpack config to match it!
    document.getElementsByTagName('body')[0].appendChild(root);
    anchorElement = document.getElementById(quiqContainerId);
  }
  render(unsupported ? <NonChat /> : <SDKLauncher />, anchorElement);
};

const bootstrap = () => {
  constructLauncher();
  bindLaunchButtons();
};

export const Quiq = (options: {[string]: any} = {}) => {
  // We should only initialize once. Throw error if called twice.
  if (initialized) {
    throw new Error(`Quiq Chat has already been initialized.
      Quiq() should only be called once.
      Note that if you have a legacy window.QUIQ object defined, we automatically call Quiq() on your behalf.`);
  }

  initialized = true;

  setQuiqOptions(buildQuiqObject(options));

  // Remove any Quiq keys from localStorage--we only wanted to send them to webchat the first time iframes were used.
  clearQuiqKeysFromLocalStorage();

  if (document.readyState === 'complete') {
    bootstrap();
  } else {
    window.addEventListener('load', bootstrap);
  }

  return Object.create(SDKPrototype);
};

export default Quiq;

/*****************************************************************************************/

// Chrome Extensions don't share window objects, we instead share Quiq Object through a hidden html element
const quiqInjectEle = document.querySelector('#quiqInject');
if (quiqInjectEle) {
  try {
    window.Quiq = Quiq;
    Quiq(JSON.parse(quiqInjectEle.innerText || ''));
  } catch (e) {
    console.error('Invalid Quiq Object injected');
  }
  // If window.QUIQ is defined, build chat instance automatically for backwards-compatibility.
} else if (window.QUIQ) {
  Quiq(camelizeToplevelScreamingSnakeCaseKeys(window.QUIQ));
} else {
  // Expose Quiq() initialization function.
  window.Quiq = Quiq;

  // Add even listener for page load to check for window.QUIQ and bootstrap
  // This is needed for legacy customers who include us prior to defining window.QUIQ
  window.addEventListener('load', () => {
    if (!initialized && window.QUIQ) {
      Quiq(camelizeToplevelScreamingSnakeCaseKeys(window.QUIQ));
    }
  });
}
