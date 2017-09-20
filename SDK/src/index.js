// @flow
/** @jsx h */
import 'babel-polyfill';
import {camelizeToplevelScreamingSnakeCaseKeys, clearQuiqKeysFromLocalStorage} from 'Common/Utils';
import {render, h} from 'preact';
import {buildQuiqObject} from 'Common/QuiqOptions';
import {quiqContainerId} from 'Common/Constants';
import {bindLaunchButtons} from 'managers/ButtonManager';
import {setQuiqOptions} from './Globals';
import SDKPrototype from './SdkPrototype';
import SDKLauncher from './components/SDKLauncher';

const constructLauncher = () => {
  const root = document.createElement('div');
  root.id = quiqContainerId; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  render(<SDKLauncher />, document.getElementById(quiqContainerId));

  // Hot Module Replacement API
  if (module.hot) {
    // $FlowIssue
    module.hot.accept('./components/SDKLauncher', () => {
      const NextSDKLauncher = require('./components/SDKLauncher').default; // eslint-disable-line global-require
      render(<NextSDKLauncher />, document.getElementById(quiqContainerId));
    });
  }
};

const bootstrap = () => {
  constructLauncher();
  bindLaunchButtons();
};

export const Quiq = (options: {[string]: any}) => {
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
