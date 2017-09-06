// @flow

import {webchatPath, eventTypes, actionTypes, quiqChatFrameId} from 'Common/Constants';
import {setup as setupMessenger, registerEventHandler, tellChat} from '../Postmaster';
import ToggleChatButton from '../styles/ToggleChatButton';
import {getQuiqOptions, setChatWindow, getChatWindow} from '../Globals';
import {isIFrame, getCalcStyle} from 'Common/Utils';

let standaloneWindowTimer;

export const buildChatIFrame = () => {
  const quiqOptions = getQuiqOptions();

  const framePosition = {
    bottom: quiqOptions.position.bottom || '24px',
    top: quiqOptions.position.top || 'inherit',
    right: quiqOptions.position.right || '24px',
    left: quiqOptions.position.left || 'inherit',
  };

  // Determine actual bottom of iframe based on whether or not we have a custom launch button
  const launchButtonHeight = quiqOptions.customLaunchButtons && quiqOptions.customLaunchButtons.length
    ? '0px'
    : (quiqOptions.styles.ToggleChatButton && quiqOptions.styles.ToggleChatButton.height) ||
    ToggleChatButton.height;

  // If chat frame doesn't yet exist, build it and append to body
  if (!document.querySelector(`#${quiqChatFrameId}`)) {
    const quiqChatFrame = document.createElement('iframe');
    quiqChatFrame.id = quiqChatFrameId;
    quiqChatFrame.src = `${quiqOptions.host}/${webchatPath}`;
    quiqChatFrame.height = "0"; // onAgentAvailabilityChange will set to proper height
    quiqChatFrame.width = quiqOptions.width.toString();
    quiqChatFrame.style.position = 'fixed';
    quiqChatFrame.style.bottom = getCalcStyle(launchButtonHeight, framePosition.bottom, '+');
    quiqChatFrame.style.right = framePosition.right.toString();
    quiqChatFrame.style.left = framePosition.left.toString();
    quiqChatFrame.style.top = framePosition.top.toString();
    quiqChatFrame.style.border = 'none';
    quiqChatFrame.onload = () => {
      handleWindowChange(window.quiqChatFrame);
      window[quiqChatFrameId].contentWindow.postMessage(
        {quiqOptions, name: 'handshake'},
        quiqOptions.host,
      );
    };
    document.body && document.body.appendChild(quiqChatFrame);
  } else {
    handleWindowChange(window[quiqChatFrameId]);
  }
};

const handleWindowChange = (newWindow: Object) => {
  setChatWindow(newWindow);
  setupMessenger();
};

// Event handlers
const handleVisibilityChange = (data: {visible: boolean}) => {
  const quiqOptions = getQuiqOptions();
  const chatWindow = getChatWindow();
  const {visible} = data;

  // If chat is in an iframe, resize iframe
  if (isIFrame(chatWindow)) {
    // Resize IFrame so that it's height is 0 when not visible
    if (visible) {
      chatWindow.height = quiqOptions.height;
    } else {
      chatWindow.height = 0;
    }
  }
};

const handleStandaloneOpen = () => {
  const quiqOptions = getQuiqOptions();
  const currentChatWindow = getChatWindow();

  const width = quiqOptions.width;
  const height = quiqOptions.height;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;

  const url = `${quiqOptions.host}/${webchatPath}`;
  const params = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  // Open standalone chat window
  const popup = window.open(url, JSON.stringify(quiqOptions), params);

  // Hide IFrame (set height to 0)
  if (isIFrame(currentChatWindow)) {
    currentChatWindow.height = 0;
  }

  // Setup services to use popup
  handleWindowChange(popup);

  // Focus popup
  popup.focus();

  /*
   * Since we popped open webchat into a new window in standalone mode,
   * this instance now needs to start listening for if that new window closes.
   */
  if (standaloneWindowTimer) clearInterval(standaloneWindowTimer);
  standaloneWindowTimer = setInterval(() => {
    if (popup.closed) {
      if (standaloneWindowTimer) clearInterval(standaloneWindowTimer);
      standaloneWindowTimer = undefined;
      handleWindowChange(window.quiqChatFrame);
      window[quiqChatFrameId].height = quiqOptions.height;
      tellChat(actionTypes.setChatVisibility, {visible: true});
    }
  }, 500);
};

// Register event handlers for this module
registerEventHandler(eventTypes.chatVisibilityDidChange, handleVisibilityChange);
registerEventHandler(eventTypes._standaloneOpen, handleStandaloneOpen);
