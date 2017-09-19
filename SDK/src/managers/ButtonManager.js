// @flow

import {getQuiqOptions, getChatWindow} from '../Globals';
import {displayWarning, displayError, isIFrame} from 'Common/Utils';
import {usingCustomLauncher} from 'Common/QuiqOptions';
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
import {constructDefaultLauncher} from '../../components/Launcher';
import ToggleChatButton from '../styles/ToggleChatButton';
import toInlineStyle from '@f/to-inline-style';

export const setupButtons = () => {
  if (!usingCustomLauncher()) constructDefaultLauncher();
  else bindLaunchButtons();
};

const bindLaunchButtons = () => {
  const {
    isMobile,
    isStorageEnabled,
    isSupportedBrowser,
    customLaunchButtons,
    mobileNumber,
  } = getQuiqOptions();

  getQuiqOptions().customLaunchButtons.forEach((selector: string) => {
    const ele = document.querySelector(selector);
    if (!ele) return displayWarning('Unable to bind launch button');
    ele.addEventListener('click', handleLaunchButtonClick);
  });

  // Add noAgentsAvailable class initially, will be removed when agents are determined to be available
  toggleClassOnCustomLaunchers(noAgentsAvailableClass, true);
  toggleClassOnCustomLaunchers(mobileClass, isMobile);
  toggleClassOnCustomLaunchers(unsupportedBrowserClass, !isSupportedBrowser);
  toggleClassOnCustomLaunchers(storageDisabledClass, !isStorageEnabled);
  toggleClassOnCustomLaunchers(hasMobileNumberClass, !!mobileNumber);
};

export const handleLaunchButtonClick = async () => {
  const quiqOptions = getQuiqOptions();
  // If we're on mobile, don't show chat. Open SMS app if mobileNumber is defined.
  if (quiqOptions.isMobile) {
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
