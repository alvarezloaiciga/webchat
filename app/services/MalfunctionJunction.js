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
import {eventTypes, actionTypes} from 'appConstants';
import {displayError, getHostingWindow} from 'utils/utils';
import messages from 'messages';
import type {ReduxStore, QuiqChatClient, ChatState} from 'types';

let dispatch;
let getState: () => ChatState;
let chatClient: QuiqChatClient;
let domain;
let postRobotClient, postRobotListener;

export const init = (_domain: string, _store: ReduxStore, _chatClient: QuiqChatClient) => {
  dispatch = _store.dispatch;
  getState = _store.getState;
  chatClient = _chatClient;
  domain = _domain;

  const hostWindow = getHostingWindow();
  postRobotClient = postRobot.client({window: hostWindow, domain});
  postRobotListener = postRobot.listener({window: hostWindow, domain});

  setupListeners();
};

const setupListeners = () => {
  if (!postRobotListener) {
    return displayError(messages.prClientUndefined);
  }

  postRobotListener.on(actionTypes.setChatVisibility, setChatVisibility);
  postRobotListener.on(actionTypes.getChatVisibility, getChatVisibility);
};

const postMessage = (messageName: string, data: Object) => {
  if (!postRobotClient) {
    return displayError(messages.prClientUndefined);
  }

  postRobotClient.send(messageName, data);
};

/**********************************************************************************
 * Event hooks (webchat -> client)
 **********************************************************************************/

export const chatVisibilityDidChange = (visible: boolean) => {
  postMessage(eventTypes.chatVisibilityDidChange, {visible});
};

/**********************************************************************************
 * View facade handlers (client -> webchat)
 **********************************************************************************/

const setChatVisibility = (event: Object) => {
  const visible = event.visible;
  dispatch(ChatActions.setChatContainerHidden(!visible));
};

const getChatVisibility = () => {
  const visible = getChatContainerHidden(getState());
};

/**********************************************************************************
 * Controller facade handlers (client -> webchat)
 **********************************************************************************/

// TODO
