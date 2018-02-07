// @flow

import * as Postmaster from './Postmaster';
import {postmasterActionTypes as actionTypes, publicEventTypes} from 'Common/Constants';
import {displayWarning, isSupportedBrowser} from 'Common/Utils';
import SDKChatContainer from './components/SDKChatContainer';

const ChatSDK = {
  /**
   * Get the current visibility of the chat UI.
   * @title Get chat visibility
   * @param callback - An optional callback function, which you can provide if you do not wish to take advantage of the returned `Promise`.
   * @return A `Promise` with an object containing a boolean `visible` key. If successful, `error` will be `null`. if unsuccessful `data` will be `null` and `error` will contain an `Error` object
   *
   * @example <caption>ESNext</caption>
   * // ESNext
   * const {visible} = await chat.getChatVisibility();
   *
   * @example
   * // ES5 (using returned Promise)
   * chat.getChatVisibility().then(function (data) {
   *    var visible = data.visible
   *    // Do something with `visible`
   * });
   *
   * @example
   * // ES5 (using callback function)
   * function cb(data, error) {
   *    if (data) {
   *        var visible = data.visible;
   *        // Do something with `visible`
   *    } else if (error) {
   *        // Handle error
   *    }
   * }
   *
   * chat.getChatVisibility(cb);
   */
  getChatVisibility: async (
    callback: (data: ?{visibility: boolean}, error: ?Error) => void,
  ): Promise<{visible: boolean}> => {
    return Postmaster.askChat(actionTypes.getChatVisibility, {}, callback);
  },

  /**
   * Set the visibility of the chat UI.
   * @title Show or hide chat
   *
   * @param visible - Whether chat should be shown (`true`) or hidden (`false`).
   *
   * @example
   * // Show chat
   * chat.setChatVisibility(true);
   */
  setChatVisibility: (visible: boolean) => {
    SDKChatContainer.setChatVisibility(visible, true);
  },

  setChatRegistrationField: (fieldId: string, fieldValue: any) => {
    Postmaster.tellChat(actionTypes.setChatRegistrationField, {fieldId, fieldValue});
  },

  /**
   * Determine whether any customer service agents are currently logged-in and available.
   * @title Get agent availability
   * @param callback - An optional callback function, which you can provide if you do not wish to take advantage of the returned `Promise`.
   * @return A `Promise` with an object containing a boolean `available` key. If successful, `error` will be `null`. if unsuccessful `data` will be `null` and `error` will contain an `Error` object
   *
   * @example <caption>ESNext</caption>
   * // ESNext
   * const {available} = await chat.getAgentAvailability();
   *
   * @example
   * // ES5 (using returned Promise)
   * chat.getAgentAvailability().then(function (data) {
   *    var available = data.available
   *    // Do something with `available`
   * });
   *
   * @example
   * // ES5 (using callback function)
   * function cb(data, error) {
   *    if (data) {
   *        var available = data.available;
   *        // Do something with `available`
   *    } else if (error) {
   *        // Handle error
   *    }
   * }
   *
   * chat.getAgentAvailability(cb);
   */
  getAgentAvailability: async (
    callback: (data: ?{available: boolean}, error: ?Error) => void,
  ): Promise<{available: boolean}> =>
    Postmaster.askChat(actionTypes.getAgentAvailability, {}, callback),

  /**
   * Get the unique ID (handle) associated with this chat session. This value can be used for calling the Start Conversation API or for your own tracking.
   * @title Get handle
   * @param callback - An optional callback function, which you can provide if you do not wish to take advantage of the returned `Promise`.
   * @return A `Promise` with an object containing a string `handle` key. If successful, `error` will be `null`. if unsuccessful `data` will be `null` and `error` will contain an `Error` object
   *
   * @example <caption>ESNext</caption>
   * // ESNext
   * const {handle} = await chat.getHandle();
   *
   * @example
   * // ES5 (using returned Promise)
   * chat.getHandle().then(function (data) {
   *    var available = data.handle
   *    // Do something with `handle`
   * });
   *
   * @example
   * // ES5 (using callback function)
   * function cb(data, error) {
   *    if (data) {
   *        var handle = data.handle;
   *        // Do something with `handle`
   *    } else if (error) {
   *        // Handle error
   *    }
   * }
   *
   * chat.getHandle(cb);
   */
  getHandle: async (
    callback: (data: ?{handle: string}, error: ?Error) => void,
  ): Promise<{handle: string}> => Postmaster.askChat(actionTypes.getHandle, {}, callback),

  /**
   * Get the status of the current chat session.
   * @title Get status
   * @param callback - An optional callback function, which you can provide if you do not wish to take advantage of the returned `Promise`.
   * @return A `Promise` with an object containing a boolean `active` key, indicating whether the customer is currently chatting with an agent. If successful, `error` will be `null`. if unsuccessful `data` will be `null` and `error` will contain an `Error` object
   *
   * @example <caption>ESNext</caption>
   * // ESNext
   * const {active} = await chat.getChatStatus();
   *
   * @example
   * // ES5 (using returned Promise)
   * chat.getChatStatus().then(function (data) {
   *    var active = data.active
   *    // Do something with `active`
   * });
   *
   * @example
   * // ES5 (using callback function)
   * function cb(data, error) {
   *    if (data) {
   *        var handle = data.active;
   *        // Do something with `active`
   *    } else if (error) {
   *        // Handle error
   *    }
   * }
   *
   * chat.getChatStatus(cb);
   */
  getChatStatus: async (
    callback: (data: ?{active: boolean}, error: ?Error) => void,
  ): Promise<{active: boolean}> => Postmaster.askChat(actionTypes.getChatStatus, {}, callback),

  /**
   * Determine whether the user's browser is supported by Webchat.
   * @title Supported browser
   * @param callback - An optional callback function, which you can provide if you do not wish to take advantage of the returned `Promise`.
   * @return A `Promise` with an object containing a boolean `supported` key, indicating whether the user's browser support. If successful, `error` will be `null`. if unsuccessful `data` will be `null` and `error` will contain an `Error` object
   *
   * @example <caption>ESNext</caption>
   * // ESNext
   * const {supported} = await chat.getIsSupportedBrowser();
   *
   * @example
   * // ES5 (using returned Promise)
   * chat.getIsSupportedBrowser().then(function (data) {
   *    var supported = data.supported
   *    // Do something with `supported`
   * });
   *
   * @example
   * // ES5 (using callback function)
   * function cb(data, error) {
   *    if (data) {
   *        var supported = data.supported;
   *        // Do something with `supported`
   *    } else if (error) {
   *        // Handle error
   *    }
   * }
   *
   * chat.getIsSupportedBrowser(cb);
   */
  getIsSupportedBrowser: async (
    callback: (data: ?{supported: boolean}, error: ?Error) => void,
  ): Promise<{supported: boolean}> => {
    const supported = isSupportedBrowser();
    if (callback) {
      callback({supported});
    }
    return {supported};
  },

  /**
   * Register an event listener with Webchat.
   *
   * The following events are supported, and call your handler function with an object containing the specified fields:
   * <table>
   *   <tr>
   *     <th>Event</th>
   *     <th>Description</th>
   *     <th>`event` object fields</th>
   *   </tr>
   *   <tr>
   *     <td>QUIQ_CHAT_VISIBILITY_DID_CHANGE</td>
   *     <td>Fired when chat is either shown or hidden by the user</td>
   *     <td>`visible: boolean`</td>
   *   </tr>
   *   <tr>
   *     <td>QUIQ_MESSAGE_ARRIVED</td>
   *     <td>Fired when a new messages arrives, whether from the agent, system or the customer.</td>
   *     <td>
   *       `message: {
   *          authorType: 'User' | 'Customer',
   *          text: string,
   *          id: string,
   *          timestamp: string,
   *          type: 'Text
   *       }
   *       |
   *       {
   *          authorType: AuthorType,
   *          url: string,
   *          id: string,
   *          contentType: string,
   *          timestamp: number,
   *          type: 'Attachment'
   *       }`
   *       (`message` is either a Text or Attachment message)
   *     </td>
   *    <tr>
   * </table>
   * @title Register event listener
   * @param eventName - The name of the event to listen for. See examples for possible values.
   * @param handler - A function that will be called when the specified event occurs. It will be called with a single object containing event data. See examples for fields specific to each event type.
   *
   * @example
   * // Listen for new messages
   * chat.on('QUIQ_MESSAGE_ARRIVED', function (e) {
   *    console.log(e.message);
   * });
   *
   * @example
   * // Listen for chat visibility change
   * chat.on('QUIQ_CHAT_VISIBILITY_DID_CHANGE', function (e) {
   *    if (e.visible) {
   *        console.log("Chat was just made visible by user");
   *    } else {
   *        console.log("Chat was just hidden by user");
   *    }
   * });
   */
  on: (eventName: string, handler: (e: Object) => void) => {
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

export default ChatSDK;
