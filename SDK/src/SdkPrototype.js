// @flow

import * as Messenger from './services/Postmaster';
import {actionTypes, publicEventTypes} from 'Common/Constants';
import {isIFrame,} from 'Common/Utils';
import {getChatWindow} from './Globals';

export default {
  setChatVisibility: (visible: boolean) => {
    // NOTE: Focus must be done from the SDK, not webchat, as call to focus() must originate from user interaction
    if (!isIFrame(getChatWindow())) {
      return getChatWindow().focus();
    }
    Messenger.tellChat(actionTypes.setChatVisibility, {visible});
  },
  getChatVisibility: async (callback: (data: ?{visibility: boolean}, error: ?Error) => void): Promise<{visible: boolean}> => {
    return await Messenger.askChat(actionTypes.getChatVisibility, {}, callback);
  },
  getAgentAvailability: async (callback: (data: ?{available: boolean}, error: ?Error) => void): Promise<{available: boolean}> => {
    return await Messenger.askChat(actionTypes.getAgentAvailability, {}, callback);
  },
  on: (eventName: string, handler: (data: Object) => any) => {
    Messenger.removeEventHandler(eventName, handler);
    Messenger.registerEventHandler(eventName, handler);
  },
  eventTypes: publicEventTypes,
};