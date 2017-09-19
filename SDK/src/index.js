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
import {setQuiqOptions, getQuiqOptions} from './Globals';
import SDKPrototype from './SdkPrototype';
import QuiqChatClient from 'quiq-chat';

const bootstrap = () => {
  try {
    // Setup Launcher even for unsupported browsers and no storage so we can add the css class to custom launchers
    setupButtons();

    if (!getQuiqOptions().isStorageEnabled || !getQuiqOptions().isSupportedBrowser) return;
    buildChatIFrame();
  } catch (e) {
    displayError(`Quiq: error bootstrapping webchat: ${e}`);
  }
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
