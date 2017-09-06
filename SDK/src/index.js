// @flow

import {defaultOptions} from 'Common/Constants';
import {
  getWebchatHostFromScriptTag,
  getWindowDomain,
  camelizeToplevelScreamingSnakeCaseKeys,
  displayError,
  getQuiqKeysFromLocalStorage,
  clearQuiqKeysFromLocalStorage,
} from 'Common/Utils';
import {buildChatIFrame} from 'managers/FrameManager';
import {setupButtons} from 'managers/ButtonManager';
import {setQuiqOptions} from './Globals';
import SDKPrototype from './SdkPrototype';

export const Quiq = (options: {[string]: any}) => {
  const quiqOptions = Object.assign({}, defaultOptions, options);

  // If HOST is explicitly defined in options, use that. If not, try to find from script tag URL
  quiqOptions.host = quiqOptions.host || getWebchatHostFromScriptTag();

  quiqOptions.clientDomain = getWindowDomain();

  // Transfer Quiq keys from this site's localStorage to iframe's local storage
  // TODO: This logic can be removed in October 2018, when all sessions from before September 2017 have expired
  quiqOptions.localStorageKeys = getQuiqKeysFromLocalStorage();

  setQuiqOptions(quiqOptions);

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
