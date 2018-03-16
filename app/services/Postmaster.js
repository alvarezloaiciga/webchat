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
import {eventTypes, postmasterActionTypes as actionTypes, displayModes} from 'Common/Constants';
import {displayError, getHostingWindow, getQuiqKeysFromLocalStorage} from 'Common/Utils';
import {constructApp, destructApp, appIsMounted} from 'utils/domUtils';
import QuiqChatClient from 'quiq-chat';
import type {ReduxStore} from 'types';

let reduxWatch;
let store;
let domain;
let postRobotClient, postRobotListener;

postRobot.CONFIG.LOG_LEVEL = 'error';

export const init = (_domain: string, _store: ReduxStore) => {
  store = _store;
  domain = _domain;

  reduxWatch = watchStore(_store);

  // Listen to parent/host page
  const hostWindow = getHostingWindow();

  if (!hostWindow) {
    return;
  }

  postRobotClient = postRobot.client({window: hostWindow, domain});
  postRobotListener = postRobot.listener({window: hostWindow, domain});

  setupListeners();
  setupReduxHooks();
};

/**
 * Ensure that the postRobot client is in a good state, and that hosting window exists.
 * @returns {boolean}
 */
const preflight = (): boolean => {
  const hostingWindow = getHostingWindow();

  // Do not post message if parent window has been closed
  if (!hostingWindow || hostingWindow.closed) {
    return false;
  }

  if (!postRobotClient) {
    return displayError('Postmaster.init() must be called prior to sending message.');
  }

  return true;
};

const setupListeners = () => {
  if (!postRobotListener) {
    return displayError('Postmaster.init() must be called prior to setting up listeners.');
  }

  postRobotListener.on(actionTypes.loadChat, loadChat);
  postRobotListener.on(actionTypes.unloadChat, destructApp);
  postRobotListener.on(actionTypes.setChatVisibility, setChatVisibility);
  postRobotListener.on(actionTypes.getChatVisibility, getChatVisibility);
  postRobotListener.on(actionTypes.getHandle, getHandle);
  postRobotListener.on(actionTypes.getChatStatus, getChatStatus);
  postRobotListener.on(actionTypes.getAgentAvailability, getAgentAvailability);
  postRobotListener.on(actionTypes.getCanFlashNotifications, getCanFlashNotifications);
  postRobotListener.on(actionTypes.getMobileChatEnabled, getMobileChat);
  postRobotListener.on(actionTypes.getLocalStorage, getLocalStorage);
};

export const tellClient = (messageName: string, data: Object = {}) => {
  if (preflight()) {
    postRobotClient.send(messageName, data);
  }
};

/**********************************************************************************
 * "Automatic event hooks (webchat -> client)
 **********************************************************************************/
const setupReduxHooks = () => {
  if (!reduxWatch) {
    return displayError('Postmaster.init() must be called prior to sending message.');
  }

  // Send events to SDK in response to changes in redux state
  // ChatContainer visibility
  reduxWatch.watch(ChatSelectors.getChatContainerHidden, hidden =>
    tellClient(eventTypes.chatVisibilityDidChange, {visible: !hidden}),
  );

  // Chat launcher visibility
  reduxWatch.watch(ChatSelectors.getChatLauncherHidden, hidden =>
    tellClient(eventTypes._launchButtonVisibilityShouldChange, {
      visible: !hidden,
    }),
  );

  // Configs
  reduxWatch.watch(ChatSelectors.getConfiguration, configuration =>
    tellClient(eventTypes._configurationDidChange, {
      configuration,
    }),
  );
};

/**********************************************************************************
 * Manual event hooks (webchat -> client)
 **********************************************************************************/

export const chatVisibilityDidChange = (visible: boolean) => {
  tellClient(eventTypes.chatVisibilityDidChange, {visible});
};

export const standaloneOpen = () => {
  const configuration = ChatSelectors.getConfiguration();
  store.dispatch(ChatActions.setChatContainerHidden(true));
  tellClient(eventTypes._standaloneOpen, {
    localStorageKeys: getQuiqKeysFromLocalStorage(configuration.contactPoint),
  });
};

/**********************************************************************************
 * View facade handlers (client -> webchat)
 **********************************************************************************/

const loadChat = () => {
  if (!appIsMounted()) {
    constructApp(store);
  }
};

const setChatVisibility = (event: Object) => {
  const configuration = ChatSelectors.getConfiguration();
  const {visible} = event.data;

  // If we are in 'UNDOCKED' mode, turn around and fire an open standalone event
  if (visible && configuration.displayMode === displayModes.UNDOCKED) {
    standaloneOpen();
  } else {
    store.dispatch(ChatActions.setChatContainerHidden(!visible));
  }
};

const getChatVisibility = () => {
  return {visible: !ChatSelectors.getChatContainerHidden(store.getState())};
};

const getCanFlashNotifications = () => {
  return {canFlash: ChatSelectors.getConfiguration(store.getState()).flashNotificationOnNewMessage};
};

const getMobileChat = () => {
  return {enableMobileChat: ChatSelectors.getConfiguration(store.getState()).enableMobileChat};
};

const getLocalStorage = () => {
  const configuration = ChatSelectors.getConfiguration();
  return {localStorageKeys: getQuiqKeysFromLocalStorage(configuration.contactPoint)};
};

/**********************************************************************************
 * Controller (QuiqChatClient) facade handlers (client -> webchat)
 **********************************************************************************/

// NOTE: Returns {available: boolean}
// We don't need to wrap the result into an object here since it comes prepackaged that way from the API
const getAgentAvailability = async () => QuiqChatClient.checkForAgents();

const getHandle = async () => {
  return {
    handle: QuiqChatClient.getHandle() || (await QuiqChatClient.login()),
  };
};

const getChatStatus = async () => {
  // Fetch subscribed from local storage
  let subscribed = QuiqChatClient.isUserSubscribed();

  // If locally we think we're unsubscribed, and user has a tracking ID, do deep fetch of subscribed
  // in case user came subscribed out of band (via start conversation API)
  if (!subscribed && QuiqChatClient.getHandle()) {
    subscribed = await QuiqChatClient._deepGetUserSubscribed();
  }

  return {
    active: subscribed,
  };
};
