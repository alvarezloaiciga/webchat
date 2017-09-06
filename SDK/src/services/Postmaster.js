// @flow

import postRobot from 'post-robot/dist/post-robot.ie';
import {eventTypes, bridgePath} from 'Common/Constants';
import {displayError, displayWarning, isIFrame} from 'Common/Utils';
import {getChatWindow, getQuiqOptions} from '../Globals';

postRobot.CONFIG.LOG_LEVEL = 'error';

const handlers: {[string]: Array<?(data: Object) => any>} = {};
let postRobotClient, postRobotListener;
let listeners = [];

/*****************************************************
 * ABOUT EVENT HANDLING
 * We listen for each supported event type on the postRobot messaging channel between the SDK and the webchat iframe
 * Each event type is associated with an array of event handling functions. Anything may register a function to handle an event.
 * For example, Quiq.js will register an eventHandler when the user calls the .on() function.
 * When an event is triggered, event handler functions are called in the order they appear in the array.
 *****************************************************/

export const setup = () => {
  const chatWindow = getChatWindow();
  const host = getQuiqOptions().host;

  cancelListeners();

  // Build cross-domain bridge (for IE compatibility)
  postRobot.bridge.openBridge(`${host}/${bridgePath}`);

  // Because of an oddity in post-robot, we can't pass an iframe into postRobot.listener(). Need to find the associated window.
  const targetWindow = isIFrame(chatWindow) ? chatWindow.contentWindow : chatWindow;

  postRobotClient = postRobot.client({window: targetWindow, timeout: 2000, host});
  postRobotListener = postRobot.listener({window: targetWindow, host});
  setupListeners();
};

export const registerEventHandler = (event: string, handler: (data: Object) => any) => {
  // Ensure this event has a key in the handlers object, if not create it and assign an empty array to it
  if (!Array.isArray(handlers[event])) {
    handlers[event] = [];
  }
  handlers[event].push(handler);
};

export const removeEventHandler = (event: string, handler: (data: Object) => any) => {
  if (Array.isArray(handlers[event])) {
    const idx = handlers[event].indexOf(handler);
    if (idx > -1) {
      handlers[event].splice(idx, 1);
    }
  }
};

export const tellChat = (messageName: string, data: Object) => {
  if (!postRobotClient) {
    displayError(
      'You must set the webchat window and domain, and then call Postmaster.setup(), before trying to post a message!',
    );
  }
  postRobotClient.send(messageName, data);
};

export const askChat = async (
  messageName: string,
  data: ?Object,
  callback: ?(data: ?Object, error: ?Error) => any,
): Promise<Object> => {
  if (!postRobotClient) {
    displayError(
      'You must set the webchat window and domain, and then call Postmaster.setup(), before trying to post a message!',
    );
  }

  try {
    const response = await postRobotClient.send(messageName, data || {});

    if (callback) {
      callback(response.data, null);
    }

    return response.data;
  } catch (error) {
    if (callback) callback(null, error);

    throw error;
  }
};

const setupListeners = () => {
  if (!postRobotListener) {
    displayError(
      'You must set the webchat window and domain, and then call Postmaster.setup(), before trying to create a message listener',
    );
  }

  listeners = Object.values(eventTypes).map(e => {
    // $FlowIssue - flow cannot infer type of Object.{entries, keys, values}
    return postRobotListener.on(e, handleEvent(e));
  });
};

const cancelListeners = () => {
  listeners.forEach(listener => listener.cancel());
  listeners = [];
};

const handleEvent = (eventName: string) => event => {
  if (handlers.hasOwnProperty(eventName)) {
    handlers[eventName].forEach(f => f && f(event.data));
  } else if (!Object.values(eventTypes).includes(eventName)) {
    displayWarning(`QUIQ SDK: Unknown event type received: ${eventName}`);
  }
};
