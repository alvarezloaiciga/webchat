// @flow

import {getQuiqOptions, getChatWindow} from '../Globals';
import {displayWarning, displayError, isMobile, isIFrame} from 'Common/Utils';
import * as Messenger from '../services/Postmaster';
import {
  actionTypes,
  eventTypes,
  noAgentsAvailableClass,
  mobileClass,
  launchButtonIconCloseId,
  launchButtonIconOpenId,
  launchButtonId,
} from 'Common/Constants';
import ToggleChatButton from '../styles/ToggleChatButton';
import toInlineStyle from '@f/to-inline-style';

export const setupButtons = () => {
  const quiqOptions = getQuiqOptions();
  if (quiqOptions.customLaunchButtons && quiqOptions.customLaunchButtons.length) {
    bindCustomLaunchButtons();
  } else if (!isMobile() || (isMobile() && quiqOptions.mobileNumber)) {
  // If user is on mobile, and no mobileNumber is defined, don't show the default launch button
    addDefaultLaunchButton();
  }
};

const bindCustomLaunchButtons = () => {
  const {customLaunchButtons} = getQuiqOptions();
  if (customLaunchButtons && Array.isArray(customLaunchButtons)) {
    customLaunchButtons.forEach((selector: string) => {
      const ele = document.querySelector(selector);
      if (!ele) return displayWarning('Unable to bind custom launch button');

      // Add noAgentsAvailable class initially, will be removed when agents are determined to be available
      ele.classList.add(noAgentsAvailableClass);

      if (isMobile()) ele.classList.add(mobileClass);

      ele.addEventListener('click', handleLaunchButtonClick);
    });
  }
};

const addDefaultLaunchButton = () => {
  const {colors, styles, color} = getQuiqOptions();
  const iconStyle = toInlineStyle(styles.ToggleChatButtonIcon || {});
  const buttonStyle = toInlineStyle(
    Object.assign({},
      ToggleChatButton,
      {backgroundColor: colors.primary || color || '#59ad5d'},
      styles.ToggleChatButton),
  );
  const button = `<button id="${launchButtonId}" style="${buttonStyle}" class="ToggleChatButton" onmouseout="this.style.boxShadow='rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'" onmouseover="this.style.boxShadow='rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'">
                    <svg id="${launchButtonIconOpenId}" style="${iconStyle}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z" />
                        O
                    </svg>
                 </button>`;

  // Append button before end of <body>
  const body = document.querySelector('body');
  if (!body) {
    return displayError("HTML 'body' tag is unavailable, can't add default chat launch button");
  }
  body.insertAdjacentHTML('beforeend', button);

  // Add click event and hover event listener to button
  const buttonElement = document.querySelector(`#${launchButtonId}`);
  if (!buttonElement) {
    return displayError('Unable to find default launch button element to bind click handler');
  }
  buttonElement.addEventListener('click', handleLaunchButtonClick);
};

const handleLaunchButtonClick = async () => {
  const quiqOptions = getQuiqOptions();
  // If we're on mobile, don't show chat. Open SMS app if mobileNumber is defined.
  if (isMobile()) {
    if (quiqOptions.mobileNumber)
      window.location = `sms:${quiqOptions.mobileNumber}`;
    return;
  }

  // If chat is in it's own window, focus that window
  if (!isIFrame(getChatWindow())) {
    return getChatWindow().focus();
  }

  // Set visibility of container if chat is docked
  const {visible} = await Messenger.askChat(actionTypes.getChatVisibility);
  Messenger.tellChat(actionTypes.setChatVisibility, {visible: !visible});
};

const handleLaunchButtonVisibilityChange = (data: {visible?: boolean}) => {
  const {visible} = data;
  const quiqOptions = getQuiqOptions();
  let allLaunchButtons = [];

  if (quiqOptions.customLaunchButtons && quiqOptions.customLaunchButtons.length) {
    allLaunchButtons = quiqOptions.customLaunchButtons;
  } else {
    // Default launch button
    allLaunchButtons.push(`#${launchButtonId}`);
  }

  allLaunchButtons.forEach((selector: string) => {
    const button = document.querySelector(selector);
    if (button) {
      if (visible) {
        button.classList.remove(noAgentsAvailableClass);
      } else {
        button.classList.add(noAgentsAvailableClass);
      }
    }
  });
};

const handleChatVisibilityChange = (data: {visible?: boolean}) => {
  const {visible} = data;
  const {styles} = getQuiqOptions();

  // If chat is visible, then

  const iconStyle = toInlineStyle(styles.ToggleChatButtonIcon || {});

  // Update SVG icon of default launch button, if it exists
  const button = document.querySelector(`#${launchButtonId}`);
  if (button) {
    button.innerHTML = visible
      ? `
           <svg id="${launchButtonIconCloseId}" style="${iconStyle}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
               X
          </svg>
     `
      : `
           <svg id="${launchButtonIconOpenId}" style="${iconStyle}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path d="M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z" />
               O
           </svg>
     `;
  }
};

// Register event handlers for this module
Messenger.registerEventHandler(eventTypes.chatVisibilityDidChange, handleChatVisibilityChange);
Messenger.registerEventHandler(
  eventTypes._launchButtonVisibilityShouldChange,
  handleLaunchButtonVisibilityChange,
);
