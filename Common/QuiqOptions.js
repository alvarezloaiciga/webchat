// @flow
import messages from 'Common/Messages';
import {
  setLocalStorageItemsIfNewer,
  getWebchatHostFromScriptTag,
  getWindowDomain,
  getQuiqKeysFromLocalStorage,
  isStorageEnabled,
  getOrElse,
  isMobile,
} from 'Common/Utils';
import merge from 'lodash/merge';
import type {QuiqObject} from 'Common/types';

// This should be called from the client site, by the SDK.
// If called from within the webchat Iframe, some of the default values don't make sense.
export const buildQuiqObject = (rawQuiqObject: Object): QuiqObject => {
  let {host} = rawQuiqObject;
  if (host) {
    if (host.endsWith('/')) {
      host = host.slice(0, -1);
    }
  } else {
    host = getWebchatHostFromScriptTag();
  }

  const primaryColor =
    (rawQuiqObject.colors && rawQuiqObject.colors.primary) || rawQuiqObject.color || '#59ad5d';
  const contactPoint = rawQuiqObject.contactPoint || 'default';
  const quiqOptions = {
    contactPoint,
    displayMode: isMobile() ? 'undocked' : rawQuiqObject.displayMode || 'either',
    customScreens: rawQuiqObject.customScreens || {},
    anchorElement: rawQuiqObject.anchorElement,
    agentsAvailableTimer:
      rawQuiqObject.agentsAvailableTimer && rawQuiqObject.agentsAvailableTimer >= 60000
        ? rawQuiqObject.agentsAvailableTimer
        : 60000,
    // Transfer Quiq keys from this site's localStorage to iframe's local storage.
    // We search for non-contact point namespaced keys, since namespaced keys were never used in legacy webchat.
    // TODO: This logic can be removed in October 2018, when all sessions from before September 2017 have expired
    localStorageKeys:
      rawQuiqObject.localStorageKeys ||
      (isStorageEnabled() ? getQuiqKeysFromLocalStorage(null, contactPoint) : {}),
    enforceAgentAvailability: getOrElse(rawQuiqObject.enforceAgentAvailability, true),
    color: rawQuiqObject.color || primaryColor,
    colors: Object.assign(
      {},
      {
        primary: primaryColor,
        error: '#ad2215',
        menuText: '#2199e8',
        eventText: '#888',
        agentMessageText: '#000',
        agentMessageLinkText: '#2199e8',
        agentMessageBackground: '#fff',
        customerMessageText: '#fff',
        customerMessageLinkText: '#fff',
        customerMessageBackground: primaryColor,
        attachmentMessageColor: '#9c9c9f',
        transcriptBackground: '#f4f4f8',
        typingIndicatorForeground: '#2199e8',
        typingIndicatorBackground: '#66b9ef',
        browserTheme: null,
        shadow: 'rgba(0, 0, 0, 0.117647)',
      },
      rawQuiqObject.colors,
    ),
    icons: rawQuiqObject.icons || {},
    events: {showTime: true, ...rawQuiqObject.events},
    styles: rawQuiqObject.styles || {},
    position: rawQuiqObject.position || {},
    headerText: rawQuiqObject.headerText || messages.hereToHelp,
    host,
    clientDomain: rawQuiqObject.clientDomain || getWindowDomain(),
    href: window.location.href, // Standalone uses this to determine original host URL for welcome form
    fontFamily: rawQuiqObject.fontFamily || 'sans-serif',
    width: rawQuiqObject.width || 400,
    height: rawQuiqObject.height || 600,
    autoPopTime: rawQuiqObject.autoPopTime,
    customLaunchButtons: rawQuiqObject.customLaunchButtons || [],
    showDefaultLaunchButton: getOrElse(
      rawQuiqObject.showDefaultLaunchButton,
      !Array.isArray(rawQuiqObject.customLaunchButtons) ||
        rawQuiqObject.customLaunchButtons.length === 0,
    ),
    mobileNumber: rawQuiqObject.mobileNumber,
    includeEmojis: rawQuiqObject.includeEmojis,
    excludeEmojis: rawQuiqObject.excludeEmojis,
    defaultCustomerAvatar: rawQuiqObject.defaultCustomerAvatar,
    defaultAgentAvatar: rawQuiqObject.defaultAgentAvatar,
    messages: merge(
      // Deep merge so that emojis messages are also merged
      {},
      {
        pageTitle: messages.pageTitle,
        titleText: '',
        headerText: rawQuiqObject.headerText || messages.hereToHelp,
        messageFieldPlaceholder: messages.sendUsAMessage,
        invalidEmailErrorMessage: messages.invalidEmailErrorMessage,
        welcomeFormValidationErrorMessage: messages.welcomeFormValidationError,
        welcomeFormSubmitButtonLabel: messages.submitWelcomeForm,
        welcomeFormSubmittingButtonLabel: messages.submittingWelcomeForm,
        agentTypingMessage: messages.agentIsTyping,
        agentAssignedMessage: messages.agentAssigned,
        agentEndedConversationMessage: messages.agentEndedConversation,
        agentsNotAvailableMessage: messages.agentsNotAvailable,
        connectingMessage: messages.connecting,
        reconnectingMessage: messages.reconnecting,
        errorMessage: messages.errorState,
        requiredFieldAriaLabel: messages.required,
        dockWindowTooltip: messages.dockWindow,
        openInNewWindowTooltip: messages.openInNewWindow,
        closeWindowTooltip: messages.closeWindow,
        emojiPickerTooltip: messages.emojiPickerTooltip,
        sendButtonLabel: messages.send,
        attachmentBtnTooltip: messages.attachmentBtnTooltip,
        optionsMenuTooltip: messages.optionsMenuTooltip,
        emailTranscriptMenuMessage: messages.emailTranscriptMenuMessage,
        emailTranscriptMenuTooltip: messages.emailTranscriptMenuTooltip,
        emailTranscriptInputPlaceholder: messages.emailTranscriptInputPlaceholder,
        emailTranscriptInputCancelTooltip: messages.emailTranscriptInputCancelTooltip,
        emailTranscriptInputSubmitTooltip: messages.emailTranscriptInputSubmitTooltip,
        emailTranscriptInlineButton: messages.emailTranscriptInlineButton,
        messageArrivedNotification: messages.messageArrivedNotification,
        transcriptEmailedEventMessage: messages.transcriptEmailedEventMessage,
        unsupportedFileType: messages.unsupportedFileType,
        attachmentTooLarge: messages.attachmentTooLarge,
        attachmentUploadError: messages.attachmentUploadError,
        muteSounds: messages.muteSounds,
        unmuteSounds: messages.unmuteSounds,
        muteSoundsTooltip: messages.muteSoundsTooltip,
        unmuteSoundsTooltip: messages.unmuteSoundsTooltip,
        cannotStartNewConversationMessage: messages.cannotStartNewConversationMessage,
        emojiPicker: messages.emojiMessages,
        unsupportedOrientation: messages.unsupportedOrientation,
        unableToSend: messages.unableToSend,
        infectedFile: messages.infectedFile,
        emptyUpload: messages.emptyUpload,
      },
      rawQuiqObject.messages,
    ),
    // The following are internal, unsupported options used for E2E testing
    _internal: rawQuiqObject._internal || {},
  };

  return quiqOptions;
};

const processInternalOptions = (quiqOptions: QuiqObject) => {
  const {captureRequests, captureWebsockets} = quiqOptions._internal;

  // Setup request hook. This overrides the native fetch and xhr methods.
  // That's why we only do this when this option is specified.
  if (captureRequests) {
    window.__quiq__capturedRequests = [];
    const originalFetch = window.fetch;
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method: string, url: string) {
      window.__quiq__capturedRequests.push({method, url});
      return originalXhrOpen.call(this, method, url);
    };

    window.fetch = function(url: string, request: Object) {
      const method = request.method || 'GET';
      window.__quiq__capturedRequests.push({method, url});
      return originalFetch.call(this, url, request);
    };
  }

  if (captureWebsockets) {
    window.__quiq__ws = {
      instances: [],
      // $FlowIssue - Flow doesn't know how to handle get/set
      get connectedCount() {
        return this.instances.filter(ws => ws.readyState === 1).length;
      },
    };

    const originalWS = window.WebSocket;
    window.WebSocket = function(url: string, protocols: string) {
      const ws = new originalWS(url, protocols);
      window.__quiq__ws.instances.push(ws);
      return ws;
    };
  }
};

// $FlowIssue - It's possible for this to return undefined if localStorage is disabled. We are ok with this.
const getQuiqOptions = (): QuiqObject => {
  try {
    const quiqObject = JSON.parse(localStorage.getItem('quiqOptions') || '{}');

    // Set local storage items from quiqObject.localStorage Keys
    // This is used for backwards comparability, as well as for transferring session data from IFraqme to popup
    if (quiqObject.localStorageKeys) {
      setLocalStorageItemsIfNewer(quiqObject.localStorageKeys);
    }

    // Do any setup based on internal options, such as setting up hooks
    processInternalOptions(quiqObject);

    return quiqObject;
  } catch (e) {
    return {
      localStorageDisabled: true,
    };
  }
};

/**
 * Strips out styles that would be difficult to keep backwards compatibility for
 */
export const getStyle = (userStyle?: Object = {}, defaults?: Object = {}) => {
  const unsupportedStyles = [
    'float',
    'clear',
    'top',
    'bottom',
    'left',
    'right',
    'position',
    'transform',
    'content',
  ];

  Object.keys(userStyle).forEach(property => {
    if (unsupportedStyles.includes(property)) {
      throw new Error(`Your style is using the unsupported style property '${property}'.`);
    }

    if (property === 'fontFamily' && userStyle.fontFamily) {
      const font = userStyle.fontFamily;

      ['Comic Sans', 'Papyrus'].forEach(badFont => {
        if (typeof font === 'string' && font.includes(badFont)) {
          // eslint-disable-next-line no-console
          console.warn(
            `The font ${badFont} is deprecated because it leads to a poor user experience.`,
          );
        }
      });
    }
  });

  return Object.assign({}, defaults, userStyle);
};

const quiqOptions: QuiqObject = getQuiqOptions();

export default quiqOptions;
