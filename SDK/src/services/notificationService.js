// @flow

import * as Postmaster from 'Postmaster';
import {eventTypes, actionTypes} from 'Common/Constants';
import {getDisplayString} from 'core-ui/services/i18nService';
import {getQuiqOptions, getChatWindow} from 'Globals';
import type {Message} from 'Common/types';
import {isIFrame, isLastMessageFromAgent} from 'Common/Utils';

const handleMessageArrived = async (e: {transcript: Array<Message>}) => {
  if (!appIsHidden()) return;

  const options = getQuiqOptions();

  // Only perform notifications if the chat window is docked. Otherwise, notifications
  // will be handled from within the undocked chat window.
  if (isIFrame(getChatWindow()) && isLastMessageFromAgent(e.transcript)) {
    const {canFlash} = await Postmaster.askChat(actionTypes.getCanFlashNotifications);
    if (canFlash) {
      flashTitle(getDisplayString(options.messages.messageArrivedNotification));
    }
  }
};

export const init = () => {
  Postmaster.registerEventHandler(eventTypes.messageArrived, handleMessageArrived);
};

/**
 * Gets whether or not the app is visible to the user
 */
const appIsHidden = (): boolean => {
  const prefixes = ['webkit', 'moz', 'ms', 'o'];

  if ('hidden' in document) {
    return document.hidden;
  }

  for (let i = 0; i < prefixes.length; i++) {
    if (`${prefixes[i]}Hidden` in document) {
      // $FlowIssue
      return document[`${prefixes[i]}Hidden`];
    }
  }

  // At this point it's not supported, returning false as default
  return false;
};

let oldTitle;

/**
 * Handles visibility change event, resetting title and removing related timers if app is visible again
 */
const appDidBecomeVisible = () => {
  if (appIsHidden()) return;

  // Reset title and flash timers
  window.clearInterval(window.titleFlashTimer);
  document.title = oldTitle;
  document.removeEventListener('visibilitychange', appDidBecomeVisible);
};

/**
 * Reset title and remove flash timers, regardless of visibility
 */
export const resetTitle = () => {
  // Reset title and flash timers
  window.clearInterval(window.titleFlashTimer);
  document.title = oldTitle;
  document.removeEventListener('visibilitychange', appDidBecomeVisible);
};

/**
 * Flashes the title bar if the app is blurred. Ceases when focus returns.
 * @param {string}  title           - The title to flash
 */
export const flashTitle = (title: string) => {
  // Clear any existing flash timers
  if (window.titleFlashTimer) {
    window.clearInterval(window.titleFlashTimer);
  }

  oldTitle = document.title;
  window.titleFlashTimer = window.setInterval(function() {
    document.title = document.title === oldTitle ? title : oldTitle;
  }, 1000);

  // Supported in all browsers including IE >= 10. If we want to support Android Browser 4.4 we'll need a prefix
  document.addEventListener('visibilitychange', appDidBecomeVisible);
};
