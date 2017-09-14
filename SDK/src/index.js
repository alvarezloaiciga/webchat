// @flow

import 'babel-polyfill';
import {
  camelizeToplevelScreamingSnakeCaseKeys,
  displayError,
  clearQuiqKeysFromLocalStorage,
} from 'Common/Utils';
import {buildQuiqObject} from 'Common/QuiqOptions';
import {buildChatIFrame} from 'managers/FrameManager';
import {setupButtons} from 'managers/ButtonManager';
import {setQuiqOptions} from './Globals';
import SDKPrototype from './SdkPrototype';

export const Quiq = (options: {[string]: any}) => {
  setQuiqOptions(buildQuiqObject(options));

  // Remove any Quiq keys from localStorage--we only wanted to send them webchat the first iframes were used.
  clearQuiqKeysFromLocalStorage();

  // Defer DOM-related tasks until DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        pageSetup();
      } catch (e) {
        displayError(`Quiq: error bootstrapping webchat: ${e}`);
      }
    });
  } else {
    // document.readyState === 'interactive' | 'loaded'
    pageSetup();
  }

  return Object.create(SDKPrototype);
};

const pageSetup = () => {
  buildChatIFrame();
  setupButtons();
};

export default Quiq;

/*****************************************************************************************/
// If window.QUIQ is defined, build chat instance automatically for backwards-compatibility
if (window.QUIQ) {
  Quiq(camelizeToplevelScreamingSnakeCaseKeys(window.QUIQ));
} else {
  window.Quiq = Quiq;
}
