// @flow
/**********************************************************************************
 Malfunction Junction is a dispatch service, designed to be paired with our Quiq.js
 SDK. It listens for messages sent via a postRobot channel, and then dispatches
 calls to Redux actions or the QuiqChatClient singleton.

 Before use, an instance of QuiqChatClient must be registered,
 as well as the default Redux store.
**********************************************************************************/

import postRobot from 'post-robot';
import * as ChatActions from 'actions/chatActions';
import {getChatContainerHidden} from 'reducers/chat';
import type {ReduxStore, QuiqChatClient, ChatState} from 'types';

let dispatch;
let getState: () => ChatState;
let chatClient: QuiqChatClient;
let clientWindow;
let domain;

export const start = (
  _clientWindow,
  _domain: string,
  store: ReduxStore,
  _chatClient: QuiqChatClient,
) => {
  dispatch = store.dispatch;
  getState = store.getState;
  chatClient = _chatClient;
  setupListeners();
};

const setupListeners = () => {
  // Setup listeners
  buildPostRobotListener('toggleChatVisibility', toggleChatVisibility);
  buildPostRobotListener('setChatVisibility', setChatVisibility);
};

const buildPostRobotListener = (eventName: string, handler: (event: ?Object) => any) => {
  postRobot.on(eventName, {window: clientWindow, domain}, handler);
};

/**********************************************************************************
 * View facade handlers
 **********************************************************************************/

const toggleChatVisibility = () => {
  const visible = getChatContainerHidden(getState());
  dispatch(ChatActions.setChatContainerHidden(!visible));
};

const setChatVisibility = (event: Object) => {
  const visible = event.visible;
  dispatch(ChatActions.setChatContainerHidden(!visible));
};

/**********************************************************************************
 * Controller facade handlers
 **********************************************************************************/

// TODO
