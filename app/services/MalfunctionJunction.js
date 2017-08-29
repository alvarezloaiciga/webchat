// @flow
/**********************************************************************************
 Malfunction Junction is a dispatch service, designed to be paired with our Quiq.js
 SDK. It listens for messages sent via a postRobot channel, and then dispatches
 calls to Redux actions or the QuiqChatClient singleton.

 Before use, an instance of QuiqChatClient must be registered,
 as well as the default Redux store.
 **********************************************************************************/

import postRobot from 'post-robot/dist/post-robot.ie';
import watchStore from 'redux-store-watch';
import * as ChatActions from 'actions/chatActions';
import * as ChatSelectors from 'reducers/chat';
import {eventTypes, actionTypes} from 'Common/Constants';
import {displayError, getHostingWindow, getWindowDomain} from 'Common/Utils';
import messages from 'messages';
import type {ReduxStore, ChatState} from 'types';

let reduxWatch;
let dispatch;
let getState: () => ChatState;
let chatClient;
let domain;
let postRobotClient, postRobotListener;

export const init = (_domain: string, _store: ReduxStore, _chatClient) => {
  dispatch = _store.dispatch;
  getState = _store.getState;
  chatClient = _chatClient;
  domain = _domain;

  reduxWatch = watchStore(_store);

  // Listen to parent/host page
  const hostWindow = getHostingWindow();
  postRobotClient = postRobot.client({window: hostWindow, domain});
  postRobotListener = postRobot.listener({window: hostWindow, domain});

  setupListeners();
  setupReduxHooks();
};

const setupListeners = () => {
  if (!postRobotListener) {
    return displayError(messages.mfInitNeeded);
  }

  postRobotListener.on(actionTypes.setChatVisibility, setChatVisibility);
  postRobotListener.on(actionTypes.getChatVisibility, getChatVisibility);
  postRobotListener.on(actionTypes.getAgentAvailability, getAgentAvailability);
};

const tellClient = (messageName: string, data: Object = {}) => {
  if (!postRobotClient) {
    return displayError(messages.mfInitNeeded);
  }

  postRobotClient.send(messageName, data);
};

/**********************************************************************************
 * "Automatic event hooks (webchat -> client)
 **********************************************************************************/
const setupReduxHooks = () => {
  if (!reduxWatch) {
    return displayError(messages.mfInitNeeded);
  }

  // Send events to SDK in response to changes in redux state
  // ChatContainer visibility
  reduxWatch.watch(ChatSelectors.getChatContainerHidden, hidden =>
    tellClient(eventTypes.chatVisibilityDidChange, {visible: !hidden}),
  );

  // Agent availability
  reduxWatch.watch(ChatSelectors.getAgentsAvailable, available =>
    tellClient(eventTypes.agentAvailabilityDidChange, {available}),
  );
};

/**********************************************************************************
 * Manual event hooks (webchat -> client)
 **********************************************************************************/

export const chatVisibilityDidChange = (visible: boolean) => {
  tellClient(eventTypes.chatVisibilityDidChange, {visible});
};

export const standaloneOpen = () => {
  tellClient(eventTypes.standaloneOpen);
};

/**********************************************************************************
 * View facade handlers (client -> webchat)
 **********************************************************************************/

const setChatVisibility = (event: Object) => {
  const {visible} = event.data;
  dispatch(ChatActions.setChatContainerHidden(!visible));
};

const getChatVisibility = () => {
  return {visible: !ChatSelectors.getChatContainerHidden(getState())};
};

const getAgentAvailability = () => {
  return {available: ChatSelectors.getAgentsAvailable(getState())};
};

/**********************************************************************************
 * Controller facade handlers (client -> webchat)
 **********************************************************************************/

// TODO
