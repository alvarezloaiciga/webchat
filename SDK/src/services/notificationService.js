// @flow

import {registerEventHandler} from 'Postmaster';
import {eventTypes} from 'Common/Constants';
import {getDisplayString} from 'Common/i18n';
import {getQuiqOptions} from 'Globals';
import type {Message} from 'Common/types';
import assets from 'assets';

// Load alert sound--must be done here, not inside alert function
// $FlowIssue
const canPlayMp3 = ['probably', 'maybe'].includes(new Audio().canPlayType('audio/mp3'));
const alertFile = canPlayMp3 ? assets.alertSound : assets.alertSoundWav;

// $FlowIssue
const alertSound = new Audio(alertFile);

const handleMessageArrived = (e: {transcript: Array<Message>}) => {
  if (!appIsHidden()) return;

  const options = getQuiqOptions();

  if (
    e.transcript.length > 0 &&
    e.transcript[e.transcript.length - 1].authorType === 'User'
  ) {
    if (options.flashNotificationOnNewMessage) {
      flashTitle(getDisplayString(options.messages.messageArrivedNotification));
    }
    if (options.playNotificationSoundOnNewMessage) {
      playSound();
    }
  }
};

export const init = () => {
  registerEventHandler(eventTypes.messageArrived, handleMessageArrived);
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

/**
 * Plays a sound notification. Designed for demoing sound to user.
 */
export const playSound = () => {
  alertSound.play();
};
