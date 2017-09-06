// @flow

import * as Postmaster from './Postmaster';
import {actionTypes, publicEventTypes} from 'Common/Constants';
import {isIFrame, displayWarning} from 'Common/Utils';
import {getChatWindow} from './Globals';

export default {
  setChatVisibility: (visible: boolean) => {
    // NOTE: Focus must be done from the SDK, not webchat, as call to focus() must originate from user interaction
    if (!isIFrame(getChatWindow())) {
      return getChatWindow().focus();
    }
    Postmaster.tellChat(actionTypes.setChatVisibility, {visible});
  },

  getChatVisibility: async (callback: (data: ?{visibility: boolean}, error: ?Error) => void): Promise<{visible: boolean}> => {
    return await Postmaster.askChat(actionTypes.getChatVisibility, {}, callback);
  },

  getAgentAvailability: async (callback: (data: ?{available: boolean}, error: ?Error) => void): Promise<{available: boolean}> => {
    return await Postmaster.askChat(actionTypes.getAgentAvailability, {}, callback);
  },

  on: (eventName: string, handler: (data: Object) => any) => {
    if (!publicEventTypes[eventName]) {
      displayWarning('Can\'t register for an event named "{eventName}": unknown event name.', {eventName});
      return;
    }

    const eventKey = publicEventTypes[eventName];

    Postmaster.removeEventHandler(eventKey, handler);
    Postmaster.registerEventHandler(eventKey, handler);
  },
};