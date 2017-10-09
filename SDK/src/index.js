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

const constructLauncher = () => {
  const unsupported = !isStorageEnabled() || !isSupportedBrowser();
  const options = getQuiqOptions();

  // We will add the unsupported classes to their custom launchers.
  // There's nothing for us to render.
  if (unsupported && options.customLaunchButtons.length > 0) return;

  let anchorId = quiqContainerId;
  if (options.anchorElement && options.anchorElement !== '') {
    anchorId = options.anchorElement;
  }
  else {
    const root = document.createElement('div');
    root.id = quiqContainerId; // If for some reason you change this, make sure you update the webpack config to match it!
    document.getElementsByTagName('body')[0].appendChild(root);
  }
  render(unsupported ? <NonChat /> : <SDKLauncher />, document.getElementById(anchorId));
};

const bootstrap = () => {
  constructLauncher();
  bindLaunchButtons();
};

export const Quiq = (options: {[string]: any} = {}) => {
  setQuiqOptions(buildQuiqObject(options));

  // Remove any Quiq keys from localStorage--we only wanted to send them webchat the first iframes were used.
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
// If window.QUIQ is defined, build chat instance automatically for backwards-compatibility
if (window.QUIQ) {
  Quiq(camelizeToplevelScreamingSnakeCaseKeys(window.QUIQ));
} else {
  window.Quiq = Quiq;
}
