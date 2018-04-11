// @flow
import {inStandaloneMode, isEvent} from 'Common/Utils';
import {
  ChatInitializedState,
  MessageTypes,
  EndEventTypes,
  EventTypes,
  AuthorTypes,
} from 'Common/Constants';
import flatMap from 'lodash/flatMap';
import Mime from 'mime-types';
import update from 'immutability-helper';
import findLastIndex from 'lodash/findLastIndex';
import findLast from 'lodash/findLast';
import {createSelector} from 'reselect';
import type {
  ChatState,
  Action,
  ChatInitializedStateType,
  Message,
  Event,
  ChatConfiguration,
  AttachmentError,
} from 'Common/types';
import {buildQuiqObject} from 'Common/QuiqOptions';
import {getState} from '../store';
import {getDisplayString} from 'core-ui/services/i18nService';
import type {PersistentData, Author} from 'quiq-chat/src/types';

type ChatAction = {
  chatContainerHidden?: boolean,
  chatLauncherHidden?: boolean,
  agentsAvailable?: boolean,
  initializedState?: ChatInitializedStateType,
  transcript?: Array<Message>,
  author?: Author | null,
  message?: Message,
  platformEvents?: Array<Event>,
  messageFieldFocused?: boolean,
  configuration?: ChatConfiguration,
  id?: string,
  isAgentAssigned?: boolean,
  inputtingEmail?: boolean,
  attachmentError?: AttachmentError,
  persistentData?: PersistentData,
  enabled?: boolean,
  fieldId?: string,
  fieldValue?: any,
};

export const initialState = {
  chatContainerHidden: true,
  chatLauncherHidden: true,
  agentsAvailable: undefined,
  initializedState: ChatInitializedState.UNINITIALIZED,
  transcript: {},
  platformEvents: {},
  attachmentErrors: [],
  typingAuthor: null,
  welcomeFormRegistered: false,
  muteSounds: false,
  messageFieldFocused: false,
  configuration: {
    enableChatEmailTranscript: false,
    enableChatFileAttachments: false,
    enableManualConvoStart: false,
    enableMobileChat: false,
    supportedAttachmentTypes: [],
    enableEmojis: false,
    playSoundOnNewMessage: false,
    flashNotificationOnNewMessage: false,
    registrationForm: undefined,
    menuOptions: {
      customItems: [],
      offset: undefined,
    },
    whitelistedDomains: '',
    ...buildQuiqObject({host: 'about:blank'}),
  },
  isAgentAssigned: false,
  inputtingEmail: false,
  persistentData: {},
  windowScrollLockEnabled: true,
  registrationFieldValues: {},
};

const chat = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_CONTAINER_HIDDEN':
      return Object.assign({}, state, {
        chatContainerHidden: inStandaloneMode() ? false : action.chatContainerHidden,
      });
    case 'CHAT_REGISTRATION_FIELD_SET': {
      if (action.fieldId) {
        const registrationFieldValues = Object.assign({}, state.registrationFieldValues, {
          [action.fieldId]: action.fieldValue,
        });
        return Object.assign({}, state, {registrationFieldValues});
      }
      return state;
    }
    case 'CHAT_LAUNCHER_HIDDEN':
      return Object.assign({}, state, {
        chatLauncherHidden: inStandaloneMode() ? true : action.chatLauncherHidden,
      });
    case 'UPDATE_CHAT_CONFIGURATION': {
      const configuration = Object.assign({}, state.configuration, action.configuration);
      const registrationFieldValues = Object.assign(
        {},
        state.registrationFieldValues,
        action.configuration.registrationFormFieldValues
          ? action.configuration.registrationFormFieldValues
          : {},
      );

      return Object.assign({}, state, {
        configuration,
        registrationFieldValues,
      });
    }
    case 'AGENTS_AVAILABLE':
      return Object.assign({}, state, {
        agentsAvailable: action.agentsAvailable,
      });
    case 'AGENT_ASSIGNED':
      return Object.assign({}, state, {
        isAgentAssigned: action.isAgentAssigned,
      });
    case 'CHAT_INITIALIZED_STATE':
      if (state.initializedState === ChatInitializedState.BURNED) {
        // One does not simply become unburned.
        return state;
      }

      return Object.assign({}, state, {
        initializedState: action.initializedState,
      });
    case 'UPDATE_PLATFORM_EVENTS': {
      if (!Array.isArray(action.platformEvents)) {
        return state;
      }
      const newEvents = {};
      action.platformEvents.forEach(e => {
        newEvents[e.id] = e;
      });
      return Object.assign({}, state, {platformEvents: {...state.platformEvents, ...newEvents}});
    }
    case 'UPDATE_TRANSCRIPT': {
      if (!Array.isArray(action.transcript)) return state;

      // If we received a message that replaces a pending message, remove temporary and carry over localKey
      const newTranscript = {};

      action.transcript.forEach(message => {
        let localKey, uploadProgress, localBlobUrl;
        const tempMessage = state.transcript[message.id];
        if (tempMessage) {
          // The local key allows us to correlate temporary messages to "real" ones coming in on the wire.
          // This lets React see them as the same message.
          ({localKey} = tempMessage);

          // If the temp message already has a URL, keep that one. It might be a dataURL, and we don't need to reload.
          // Also hang on to the existing uploadProgress
          if (tempMessage.type === 'Attachment' && message.type === 'Attachment') {
            uploadProgress = tempMessage.uploadProgress;
            localBlobUrl = tempMessage.localBlobUrl;
          }
        }

        newTranscript[message.id] = Object.assign({}, message, {
          localKey,
          localBlobUrl,
          uploadProgress,
        });
      });

      // Merge old and new transcripts so that we don't lose any pending (local) messages
      const mergedTranscript = Object.assign({}, state.transcript, newTranscript);
      return Object.assign({}, state, {transcript: mergedTranscript});
    }
    case 'REMOVE_MESSAGE':
      return update(state, {
        transcript: {
          $unset: [action.id],
        },
      });
    case 'ADD_PENDING_MESSAGE':
      return update(state, {transcript: {[action.message.id]: {$set: action.message}}});
    case 'UPDATE_PENDING_MESSAGE_ID': {
      const existingMessage = state.transcript[action.tempId];
      if (existingMessage) {
        return update(state, {
          transcript: {
            [action.newId]: {$set: existingMessage},
            $unset: [action.tempId],
          },
        });
      }
      return state;
    }
    case 'ADD_ATTACHMENT_ERROR':
      return {
        ...state,
        attachmentErrors: [...state.attachmentErrors, action.attachmentError],
      };
    case 'UPDATE_TYPING_AUTHOR':
      return Object.assign({}, state, {
        typingAuthor: action.author,
      });
    case 'MESSAGE_FIELD_FOCUSED':
      return Object.assign({}, state, {messageFieldFocused: action.messageFieldFocused});
    case 'WELCOME_FORM_REGISTERED':
      return Object.assign({}, state, {welcomeFormRegistered: true});
    case 'UPLOAD_PROGRESS':
      return update(state, {
        transcript: {
          [action.messageId]: {uploadProgress: {$set: action.progress}},
        },
      });
    case 'NEW_WEBCHAT_SESSION':
      // Reset state to initial state.
      // We keep the visibility state from before the new session, and we set initialized state to LOADING (while socket reconnects)
      return Object.assign(
        {},
        {...initialState},
        {
          chatContainerHidden: state.chatContainerHidden,
          chatLauncherHidden: state.chatLauncherHidden,
          agentsAvailable: state.agentsAvailable,
          configuration: state.configuration,
          initializedState: ChatInitializedState.LOADING,
        },
      );
    case 'SET_INPUTTING_EMAIL':
      return Object.assign({}, state, {inputtingEmail: action.inputtingEmail});
    case 'SET_WINDOW_SCROLL_LOCK_ENABLED':
      return Object.assign({}, state, {windowScrollLockEnabled: action.enabled});
    case 'CHAT_UPDATE_PERSISTENT_DATA':
      return Object.assign({}, state, {persistentData: action.persistentData});
    default:
      return state;
  }
};

export default chat;

// Selectors

// Comparator specification:
//  1. timestamp
//  2. events before messages
const conversationElementComparator = (a: Message | Event, b: Message | Event): number => {
  const timeDiff = a.timestamp - b.timestamp;
  if (timeDiff !== 0) {
    return timeDiff;
  }
  if (isEvent(a)) {
    // a is an Event, so we want it before b (if b is an Event as well, order is ambiguous anyways)
    return -1;
  }
  if (isEvent(b)) {
    // b is an Event, so we want it before a (if a is an Event as well, order is ambiguous anyways)
    return 1;
  }
  return 0;
};

export const getChatContainerHidden = (state: ChatState = getState()): boolean => {
  return state.chatContainerHidden;
};

// $FlowIssue - Flow can't deal with Object.values() very well
export const getTranscript = createSelector(
  (state = getState()) => state.transcript,
  transcript => Object.values(transcript),
);

export const getPlatformEvents = createSelector(
  (state = getState()) => state.platformEvents,
  // $FlowIssue - Flow does not infer types when Object.values is used
  platformEvents => Object.values(platformEvents),
);

export const getAttachmentErrors = (state: ChatState = getState()): Array<AttachmentError> =>
  state.attachmentErrors;

/**
 * Returns all Messages and Events belonging to the latest conversation, sorted by timestamp
 *  The latest conversation consists of all messages and platform events from the end of the transcript until one of the following:
 *  1) The preceding End event
 *  2) The beginning of the transcript
 * @param state
 * @return {Array.<Message|Event>}
 */
export const getLatestConversationElements = createSelector(
  [getTranscript, getPlatformEvents],
  (transcript, platformEvents) => {
    // $FlowIssue - Flow does not infer types when Object.values is used
    const sortedConvoElements: Array<Message | Event> = Object.values(transcript)
      .concat(Object.values(platformEvents))
      // $FlowIssue - Flow does not infer types when Object.values is used
      .sort(conversationElementComparator);

    const latestMessageIdx = findLastIndex(sortedConvoElements, e => {
      return (
        Object.values(MessageTypes).includes(e.type) &&
        e.authorType &&
        e.authorType !== AuthorTypes.SYSTEM
      );
    });

    // NOTE: We consider a Spam event to mark the end of a conversation the same as an End event
    const latestPrecedingEndEventIdx = findLastIndex(
      sortedConvoElements,
      e => EndEventTypes.includes(e.type),
      latestMessageIdx,
    );

    // Don't return the preceding End event itself, as this belongs to the second-to-last conversation
    return sortedConvoElements.slice(latestPrecedingEndEventIdx + 1);
  },
);

/**
 * Returns all Events and Messages across the entire transcript, i.e., all conversations, sorted.
 * @param state
 * @return {Array.<*>}
 */
export const getAllConversationElements = createSelector(
  [getTranscript, getPlatformEvents, getAttachmentErrors],
  (transcript, platformEvents, attachmentErrors) => {
    // $FlowIssue - Flow does not infer types when Object.values is used
    return (
      Object.values(transcript)
        .concat(Object.values(platformEvents))
        .concat(attachmentErrors)
        // $FlowIssue - Flow does not infer types when Object.values is used
        .sort(conversationElementComparator)
    );
  },
);

export const getAgentEndedLatestConversation = createSelector(
  getLatestConversationElements,
  elements => elements.some(e => EndEventTypes.includes(e.type)),
);

export const getLastClosedConversationIsSpam = createSelector(getPlatformEvents, events => {
  const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
  const lastEndEvent = findLast(sortedEvents, e => EndEventTypes.includes(e.type));
  return lastEndEvent && lastEndEvent.type === EventTypes.SPAM;
});

export const getClosedConversationCount = createSelector(getPlatformEvents, events =>
  events.reduce((count, e) => (EndEventTypes.includes(e.type) ? count + 1 : count), 0),
);

export const getAgentHasRespondedToLatestConversation = createSelector(
  getLatestConversationElements,
  elements =>
    elements.some(
      e => Object.values(MessageTypes).includes(e.type) && e.authorType === AuthorTypes.USER,
    ),
);

export const getAgentsAvailable = (state: ChatState = getState()): ?boolean => {
  return state.agentsAvailable;
};

export const getChatLauncherHidden = (state: ChatState = getState()): boolean => {
  return state.chatLauncherHidden;
};

export const getConfiguration = (state: ChatState = getState()): ChatConfiguration =>
  state.configuration;

export const getSupportedAttachmentExtensionString = createSelector(
  (state = getState()) => state.configuration.supportedAttachmentTypes,
  types => {
    if (!Array.isArray(types)) {
      return '';
    }

    return flatMap(types, type => {
      const extensions = Mime.extensions[type];

      // If this type was found in our database of mime types, map onto extensions
      if (Array.isArray(extensions)) {
        return extensions.map(ext => `.${ext}`);
      }

      // Otherwise, use the raw type (could be extension, for example)
      return type;
    }).join(',');
  },
);

export const getMessage = (
  messageName: string,
  values: {[string]: any} = {},
  state: ChatState = getState(),
): string => {
  const message = getConfiguration(state).messages[messageName];

  if (message === null || message === undefined)
    throw new Error(`QUIQ: Unknown message name "${messageName}"`);

  return getDisplayString(message, values);
};

export const getIsAgentAssigned = (state: ChatState = getState()): boolean => state.isAgentAssigned;

export const getInputtingEmail = (state: ChatState = getState()): boolean => state.inputtingEmail;

export const getWindowScrollLockEnabled = (state: ChatState = getState()): boolean =>
  state.windowScrollLockEnabled;

// $FlowIssue
export const getMuteSounds = (state: ChatState = getState()): boolean =>
  state.persistentData.muteSounds;

export const getRegistrationFieldValues = (state: ChatState = getState()): {[string]: any} =>
  state.registrationFieldValues;
