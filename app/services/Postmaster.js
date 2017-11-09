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
import {eventTypes, actionTypes, modes} from 'Common/Constants';
import {displayError, getHostingWindow, getQuiqKeysFromLocalStorage} from 'Common/Utils';
import type {RegistrationField} from 'Common/types';
import {constructApp, appIsMounted} from 'utils/domUtils';
import QuiqChatClient from 'quiq-chat';
import quiqOptions from 'Common/QuiqOptions';
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

  if (!postRobotClient) {
    return displayError('Postmaster.init() must be called prior to sending message.');
  }

  // Do not post message if parent window has been closed
  if (!hostingWindow || hostingWindow.closed) {
    return false;
  }

  return true;
};

const setupListeners = () => {
  if (!postRobotListener) {
    return displayError('Postmaster.init() must be called prior to setting up listeners.');
  }

  postRobotListener.on(actionTypes.loadChat, loadChat);
  postRobotListener.on(actionTypes.setChatVisibility, setChatVisibility);
  postRobotListener.on(actionTypes.getChatVisibility, getChatVisibility);
  postRobotListener.on(actionTypes.getHandle, getHandle);
  postRobotListener.on(actionTypes.getChatStatus, getChatStatus);
  postRobotListener.on(actionTypes.getAgentAvailability, getAgentAvailability);
  postRobotListener.on(actionTypes.sendRegistration, sendRegistration);
  postRobotListener.on(actionTypes.getCanFlashNotifications, getCanFlashNotifications);
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
};

/**********************************************************************************
 * Manual event hooks (webchat -> client)
 **********************************************************************************/

export const chatVisibilityDidChange = (visible: boolean) => {
  tellClient(eventTypes.chatVisibilityDidChange, {visible});
};

export const standaloneOpen = () => {
  store.dispatch(ChatActions.setChatContainerHidden(true));
  tellClient(eventTypes._standaloneOpen, {
    localStorageKeys: getQuiqKeysFromLocalStorage(quiqOptions.contactPoint),
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
  const {visible} = event.data;

  // If we are in 'UNDOCKED' mode, turn around and fire an open standalone event
  if (visible && quiqOptions.mode === modes.UNDOCKED) {
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

/**********************************************************************************
 * Controller (QuiqChatClient) facade handlers (client -> webchat)
 **********************************************************************************/

const sendRegistration = (event: Object) => {
  const registrationData: Array<RegistrationField> = event.data.registrationData;
  const registrationDictionary: {[string]: string} = {};

  for (let index = 0; index < registrationData.length; index++) {
    const data = registrationData[index];
    registrationDictionary[data.id] = data.value;
  }

  QuiqChatClient.sendRegistration(registrationDictionary);
};

// NOTE: Returns {available: boolean}
// We don't need to wrap the result into an object here since it comes prepackaged that way from the API
const getAgentAvailability = async () => await QuiqChatClient.checkForAgents();

const getHandle = async () => ({
  handle: await QuiqChatClient.getHandle(quiqOptions.host),
});

const getChatStatus = async () => ({
  active: await QuiqChatClient.isUserSubscribed(),
});
