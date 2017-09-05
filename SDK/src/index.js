// @flow

import {defaultOptions} from 'Common/Constants';
import {
  getWebchatHostFromScriptTag,
  getWindowDomain,
  camelizeToplevelScreamingSnakeCaseKeys,
  displayError,
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

  setQuiqOptions(quiqOptions);

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
