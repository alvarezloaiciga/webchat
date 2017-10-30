// @flow
import {inStandaloneMode} from 'Common/Utils';
import {ChatInitializedState} from 'Common/Constants';
import quiqOptions from 'Common/QuiqOptions';
import update from 'immutability-helper';
import type {ChatState, Action, ChatInitializedStateType, Message} from 'Common/types';

type ChatAction = {
  chatContainerHidden?: boolean,
  chatLauncherHidden?: boolean,
  agentsAvailable?: boolean,
  initializedState?: ChatInitializedStateType,
  transcript?: Array<Message>,
  agentTyping?: boolean,
  message?: Message,
};

export const initialState = {
  chatContainerHidden: true,
  chatLauncherHidden: true,
  agentsAvailable: undefined,
  initializedState: ChatInitializedState.UNINITIALIZED,
  transcript: {},
  agentTyping: false,
  agentEndedConversation: false,
  welcomeFormRegistered: !quiqOptions.welcomeForm,
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
    case 'AGENTS_AVAILABLE':
      return Object.assign({}, state, {
        agentsAvailable: action.agentsAvailable,
      });
    case 'CHAT_INITIALIZED_STATE':
      if (state.initializedState === ChatInitializedState.BURNED) {
        // One does not simply become unburned.
        return state;
      }

      return Object.assign({}, state, {
        initializedState: action.initializedState,
      });

    case 'UPDATE_TRANSCRIPT': {
      if (!Array.isArray(action.transcript)) return state;

      // If we received a message that replaces a pending message, remove temporary and carry over localKey
      const newTranscript = {};

      action.transcript.forEach(message => {
        let localKey,
          uploadProgress,
          url = message.type === 'Attachment' ? message.url : undefined;
        const tempMessage = state.transcript[message.id];
        if (tempMessage) {
          // The local key allows us to correlate temporary messages to "real" ones coming in on the wire.
          // This lets React see them as the same message.
          ({localKey} = tempMessage);

          // If the temp message already has a URL, keep that one. It might be a dataURL, and we don't need to reload.
          // Also hang on to the existing uploadProgress
          if (tempMessage.type === 'Attachment' && message.type === 'Attachment') {
            uploadProgress = tempMessage.uploadProgress;
            url = tempMessage.url;
          }
        }

        newTranscript[message.id] = Object.assign({}, message, {localKey, url, uploadProgress});
      });

      // Merge old and new transcripts so that we don't lose any pending (local) messages
      const mergedTranscript = Object.assign({}, state.transcript, newTranscript);
      return Object.assign({}, state, {transcript: mergedTranscript});
    }
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
    case 'AGENT_ENDED_CONVERSATION':
      return Object.assign({}, state, {agentEndedConversation: action.ended});
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
    default:
      return state;
  }
};

export default chat;

// Selectors
export const getChatContainerHidden = (state: ChatState): boolean => {
  return state.chatContainerHidden;
};

export const getAgentsAvailable = (state: ChatState): ?boolean => {
  return state.agentsAvailable;
};

export const getChatLauncherHidden = (state: ChatState): boolean => {
  return state.chatLauncherHidden;
};

// $FlowIssue - Flow can't deal with Object.values() very well
export const getTranscript = (state: ChatState): Array<Message> => Object.values(state.transcript);
