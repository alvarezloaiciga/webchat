// @flow
import {inStandaloneMode} from 'Common/Utils';
import {
  ChatInitializedState,
  MessageTypes,
  EndEventTypes,
  EventTypes,
  AuthorTypes,
} from 'Common/Constants';
import update from 'immutability-helper';
import findLastIndex from 'lodash/findLastIndex';
import type {
  ChatState,
  Action,
  ChatInitializedStateType,
  Message,
  Event,
  ChatConfiguration,
} from 'Common/types';
import {createSelector} from 'reselect';

type ChatAction = {
  chatContainerHidden?: boolean,
  chatLauncherHidden?: boolean,
  agentsAvailable?: boolean,
  initializedState?: ChatInitializedStateType,
  transcript?: Array<Message>,
  agentTyping?: boolean,
  message?: Message,
  muteSounds?: boolean,
  platformEvents?: Array<Event>,
  messageFieldFocused?: boolean,
  configuration?: ChatConfiguration,
  id?: string,
  isAgentAssigned?: boolean,
  inputtingEmail?: boolean,
};

export const initialState = {
  chatContainerHidden: true,
  chatLauncherHidden: true,
  agentsAvailable: undefined,
  initializedState: ChatInitializedState.UNINITIALIZED,
  transcript: {},
  platformEvents: {},
  agentTyping: false,
  welcomeFormRegistered: false,
  muteSounds: false,
  messageFieldFocused: false,
  configuration: {
    enableChatEmailTranscript: false,
    enableChatFileAttachments: false,
    supportedAttachmentTypes: ['image/png,image/jpeg'],
    enableEmojis: false,
    playSoundOnNewMessage: false,
    flashNotificationOnNewMessage: false,
    registrationForm: undefined,
    menuOptions: {
      customItems: [],
      offset: undefined,
    },
  },
  isAgentAssigned: false,
  inputtingEmail: false,
};

const chat = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_CONTAINER_HIDDEN':
      return Object.assign({}, state, {
        chatContainerHidden: inStandaloneMode() ? false : action.chatContainerHidden,
      });
    case 'CHAT_LAUNCHER_HIDDEN':
      return Object.assign({}, state, {
        chatLauncherHidden: inStandaloneMode() ? true : action.chatLauncherHidden,
      });
    case 'CHAT_CONFIGURATION_LOADED':
      return Object.assign({}, state, {
        configuration: action.configuration,
      });
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
    case 'AGENT_TYPING':
      return Object.assign({}, state, {agentTyping: action.agentTyping});
    case 'MUTE_SOUNDS':
      return Object.assign({}, state, {muteSounds: action.muteSounds});
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
          initializedState: ChatInitializedState.LOADING,
        },
      );
    case 'SET_INPUTTING_EMAIL':
      return Object.assign({}, state, {inputtingEmail: action.inputtingEmail});
    default:
      return state;
  }
};

export default chat;

// Selectors
export const getChatContainerHidden = (state: ChatState): boolean => {
  return state.chatContainerHidden;
};

// $FlowIssue - Flow can't deal with Object.values() very well
export const getTranscript = createSelector(
  state => state.transcript,
  transcript => Object.values(transcript),
);

export const getPlatformEvents = createSelector(
  state => state.platformEvents,
  // $FlowIssue - Flow does not infer types when Object.values is used
  platformEvents => Object.values(platformEvents),
);

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
      .sort((a, b) => a.timestamp - b.timestamp);

    const latestMessageIdx = findLastIndex(sortedConvoElements, e =>
      Object.values(MessageTypes).includes(e.type),
    );

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
  [getTranscript, getPlatformEvents],
  (transcript, platformEvents) => {
    // $FlowIssue - Flow does not infer types when Object.values is used
    return (
      Object.values(transcript)
        .concat(Object.values(platformEvents))
        // $FlowIssue - Flow does not infer types when Object.values is used
        .sort((a, b) => a.timestamp - b.timestamp)
    );
  },
);

export const getAgentEndedLatestConversation = createSelector(
  getLatestConversationElements,
  elements => elements.some(e => EndEventTypes.includes(e.type)),
);

export const getLatestConversationIsSpam = createSelector(getLatestConversationElements, elements =>
  elements.some(e => e.type === EventTypes.SPAM),
);

export const getAgentHasResponded = createSelector(getTranscript, transcript =>
  transcript.some(m => m.authorType === AuthorTypes.USER),
);

export const getAgentsAvailable = (state: ChatState): ?boolean => {
  return state.agentsAvailable;
};

export const getChatLauncherHidden = (state: ChatState): boolean => {
  return state.chatLauncherHidden;
};

export const getMuteSounds = (state: ChatState): boolean => {
  return state.muteSounds;
};

export const getConfiguration = (state: ChatState): ChatConfiguration => state.configuration;

export const getIsAgentAssigned = (state: ChatState): boolean => state.isAgentAssigned;

export const getInputtingEmail = (state: ChatState): boolean => state.inputtingEmail;
