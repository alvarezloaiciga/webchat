// @flow
import {defaultOptions, actionTypes, eventTypes} from 'Common/Constants';
import {
  getWebchatHostFromScriptTag,
  getWindowDomain,
  camelizeToplevelScreamingSnakeCaseKeys,
} from 'Common/Utils';
import {buildChatIFrame} from 'managers/FrameManager';
import {setupButtons} from 'managers/ButtonManager';
import {setQuiqOptions, setUsingDefaultLaunchButton} from './Globals';
import * as Messenger from './services/Messenger';

const sdkPrototype = {
  setChatVisibility: (visible: boolean) => {
    Messenger.tellChat(actionTypes.setChatVisibility, {visible});
  },
  getChatVisibility: async (callback): Promise<{visible: boolean}> => {
    return await Messenger.askChat(actionTypes.getChatVisibility, {}, callback);
  },
  getAgentAvailability: async (callback): Promise<{available: boolean}> => {
    return await Messenger.askChat(actionTypes.getAgentAvailability, {}, callback);
  },
  on: (eventName: string, handler: (data: Object) => any) => {
    Messenger.removeEventHandler(eventName, handler);
    Messenger.registerEventHandler(eventName, handler);
  },
  eventTypes,
};

export const Quiq = (options: {[string]: any}) => {
  const quiqOptions = Object.assign({}, defaultOptions, options);

  // If HOST is explicitly defined in options, use that. If not, try to find from script tag URL
  quiqOptions.host = quiqOptions.host || getWebchatHostFromScriptTag();

  quiqOptions.clientDomain = getWindowDomain();

  setQuiqOptions(quiqOptions);

  // Decide whether to show a default launch button
  if (
    quiqOptions.showDefaultLaunchButton ||
    !quiqOptions.customLaunchButtons ||
    !quiqOptions.customLaunchButtons.length
  ) {
    setUsingDefaultLaunchButton(true);
  }

  // Defer DOM-related tasks until DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        pageSetup();
      } catch (e) {
        console.error('Quiq: error bootstrapping webchat.');
        console.error(e.stack);
      }
    });
  } else {
    // document.readyState === 'interactive' | 'loaded'
    pageSetup();
  }

  return Object.create(sdkPrototype);
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
