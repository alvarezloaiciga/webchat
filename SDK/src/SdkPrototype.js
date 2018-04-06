// @flow

import * as Postmaster from './Postmaster';
import {postmasterActionTypes as actionTypes, publicEventTypes} from 'Common/Constants';
import {displayWarning, isSupportedBrowser} from 'Common/Utils';
import SDKChatContainer from './components/SDKChatContainer';

export default {
  getChatVisibility: async (
    callback: (data: ?{visibility: boolean}, error: ?Error) => void,
  ): Promise<{visible: boolean}> => {
    return Postmaster.askChat(actionTypes.getChatVisibility, {}, callback);
  },

  setChatVisibility: (visible: boolean) => {
    SDKChatContainer.setChatVisibility(visible, true);
  },

  setChatRegistrationField: (fieldId: string, fieldValue: any) => {
    SDKChatContainer.setChatRegistrationField(fieldId, fieldValue);
  },

  getAgentAvailability: async (
    callback: (data: ?{available: boolean}, error: ?Error) => void,
  ): Promise<{available: boolean}> =>
    Postmaster.askChat(actionTypes.getAgentAvailability, {}, callback),

  getHandle: async (
    callback: (data: ?{handle: string}, error: ?Error) => void,
  ): Promise<{handle: string}> => Postmaster.askChat(actionTypes.getHandle, {}, callback),

  getChatStatus: async (
    callback: (data: ?{active: boolean}, error: ?Error) => void,
  ): Promise<{active: boolean}> => Postmaster.askChat(actionTypes.getChatStatus, {}, callback),

  getIsSupportedBrowser: async (
    callback: (data: ?{supported: boolean}, error: ?Error) => void,
  ): Promise<{supported: boolean}> => {
    const supported = isSupportedBrowser();
    if (callback) {
      callback({supported});
    }
    return {supported};
  },

  on: (eventName: string, handler: (data: Object) => any) => {
    if (!publicEventTypes[eventName]) {
      displayWarning('Can\'t register for an event named "{eventName}": unknown event name.', {
        eventName,
      });
      return;
    }

    const eventKey = publicEventTypes[eventName];

    Postmaster.removeEventHandler(eventKey, handler);
    Postmaster.registerEventHandler(eventKey, handler);
  },
};
