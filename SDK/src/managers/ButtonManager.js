// @flow

import {getQuiqOptions, getChatWindow} from '../Globals';
import {
  displayWarning,
  isIFrame,
  isMobile,
  isStorageEnabled,
  isSupportedBrowser,
} from 'Common/Utils';
import * as Postmaster from '../Postmaster';
import {
  actionTypes,
  eventTypes,
  noAgentsAvailableClass,
  mobileClass,
  unsupportedBrowserClass,
  storageDisabledClass,
  hasMobileNumberClass,
} from 'Common/Constants';

export const bindLaunchButtons = () => {
  const {customLaunchButtons, mobileNumber} = getQuiqOptions();

  customLaunchButtons.forEach((selector: string) => {
    const ele = document.querySelector(selector);
    if (!ele) return displayWarning('Unable to bind launch button');
    ele.addEventListener('click', handleLaunchButtonClick);
  });

  // Add noAgentsAvailable class initially, will be removed when agents are determined to be available
  toggleClassOnCustomLaunchers(noAgentsAvailableClass, true);
  toggleClassOnCustomLaunchers(mobileClass, isMobile());
  toggleClassOnCustomLaunchers(unsupportedBrowserClass, !isSupportedBrowser());
  toggleClassOnCustomLaunchers(storageDisabledClass, !isStorageEnabled());
  toggleClassOnCustomLaunchers(hasMobileNumberClass, !!mobileNumber);
};

export const handleLaunchButtonClick = async () => {
  const quiqOptions = getQuiqOptions();
  // If we're on mobile, don't show chat. Open SMS app if mobileNumber is defined.
  if (isMobile()) {
    if (quiqOptions.mobileNumber) window.location = `sms:${quiqOptions.mobileNumber}`;
    return;
  }

  // If chat is in it's own window, focus that window
  if (!isIFrame(getChatWindow())) {
    return getChatWindow().focus();
  }

  // Set visibility of container if chat is docked
  const {visible} = await Postmaster.askChat(actionTypes.getChatVisibility);
  Postmaster.tellChat(actionTypes.setChatVisibility, {visible: !visible});
};

const toggleClassOnCustomLaunchers = (className: string, addOrRemove: boolean) => {
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
