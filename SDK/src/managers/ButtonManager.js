// @flow

import {getQuiqOptions, getChatWindow} from '../Globals';
import {
  displayWarning,
  isIFrame,
  isMobile,
  isStorageEnabled,
  isSupportedBrowser,
  getBrowserName,
  getMajor,
} from 'Common/Utils';
import * as Postmaster from '../Postmaster';
import {
  postmasterActionTypes as actionTypes,
  eventTypes,
  noAgentsAvailableClass,
  mobileClass,
  unsupportedBrowserClass,
  storageDisabledClass,
  hasMobileNumberClass,
} from 'Common/Constants';

let unsupportedGetAgentsInterval: number;
export const bindLaunchButtons = () => {
  const {customLaunchButtons, mobileNumber} = getQuiqOptions();
  if (customLaunchButtons.length === 0) return;

  customLaunchButtons.forEach((selector: string) => {
    const ele = document.querySelector(selector);
    if (!ele) return displayWarning('Unable to bind launch button');
    ele.addEventListener('click', handleLaunchButtonClick);
  });

  const unsupportedBrowser = !isSupportedBrowser();
  const storageDisabled = !isStorageEnabled();
  if (!unsupportedGetAgentsInterval && (unsupportedBrowser || storageDisabled)) {
    // If we are in a bad environment, we fall back to not using quiq-chat, since it won't
    // be available to us. We also need to handle making CORS calls on old browsers.
    oldSchoolGetAgentsAvailable((available: boolean) => {
      toggleClassOnCustomLaunchers(noAgentsAvailableClass, !available);
    });
  } else {
    toggleClassOnCustomLaunchers(noAgentsAvailableClass, true);
  }

  // Add noAgentsAvailable class initially, will be removed when agents are determined to be available
  toggleClassOnCustomLaunchers(mobileClass, isMobile());
  toggleClassOnCustomLaunchers(unsupportedBrowserClass, unsupportedBrowser);
  toggleClassOnCustomLaunchers(storageDisabledClass, storageDisabled);
  toggleClassOnCustomLaunchers(hasMobileNumberClass, !!mobileNumber);
};

export const handleLaunchButtonClick = async () => {
  const {enableMobileChat} = await Postmaster.askChat(actionTypes.getMobileChatEnabled);
  const quiqOptions = getQuiqOptions();
  // If we're on mobile and mobile chat is not enabled, don't show chat.
  // Open SMS app if mobileNumber is defined.
  if (isMobile() && !enableMobileChat) {
    if (quiqOptions.mobileNumber) window.location = `sms:${quiqOptions.mobileNumber}`;
    return;
  }

  // If chat is in its own window, focus that window
  if (!isIFrame(getChatWindow())) {
    return getChatWindow().focus();
  }

  // Set visibility of container if chat is docked
  const {visible} = await Postmaster.askChat(actionTypes.getChatVisibility);
  Postmaster.tellChat(actionTypes.setChatVisibility, {visible: !visible});
};

export const toggleClassOnCustomLaunchers = (className: string, addOrRemove: boolean) => {
  getQuiqOptions().customLaunchButtons.forEach((selector: string) => {
    const button = document.querySelector(selector);
    if (button) {
      addOrRemove
        ? (button.className += ` ${className}`)
        : (button.className = button.className.replace(` ${className}`, ''));
    }
  });
};

Postmaster.registerEventHandler(
  eventTypes._launchButtonVisibilityShouldChange,
  (data: {visible?: boolean}) => {
    toggleClassOnCustomLaunchers(noAgentsAvailableClass, !data.visible);
  },
);

/**
 * We don't have access to QuiqChatClient here since we haven't built the iFrame at this point.
 * Also, we need to support the old way of doing CORS here since this check is for potentially
 * unsupported browsers.  We lean any error case towards showing the error messages since
 * we want to be as informative as possible.
 */
export const oldSchoolGetAgentsAvailable = (callback: (available: boolean) => void) => {
  const {contactPoint, host} = getQuiqOptions();
  let agentsAvailableEndpoint = `${host}/api/v1/messaging/agents-available?contactPoint=${contactPoint}&platform=Chat`;
  const browserDetails = `${getBrowserName()}_${getMajor()}`;
  if (!isSupportedBrowser()) agentsAvailableEndpoint += `&unsupportedBrowser=${browserDetails}`;
  if (!isStorageEnabled()) agentsAvailableEndpoint += `&storageDisabled=${browserDetails}`;

  const xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // Modern way of doing CORS
    xhr.open('GET', agentsAvailableEndpoint, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          try {
            return callback(JSON.parse(xhr.responseText).available);
          } catch (e) {
            return callback(true);
          }
        } else {
          return callback(true);
        }
      }
    };
    xhr.send();
  } else if (typeof XDomainRequest !== 'undefined') {
    // Old way of doing CORS
    const xdr = new window.XDomainRequest();
    xdr.onload = () => {
      try {
        return callback(JSON.parse(xdr.responseText).available);
      } catch (e) {
        return callback(true);
      }
    };
    xdr.onerror = () => {
      return callback(true);
    };
    xdr.open('GET', agentsAvailableEndpoint, true);
    xdr.send();
  } else {
    // No support for CORS, assume available
    return callback(true);
  }
};
