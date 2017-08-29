// @flow
import {inStandaloneMode} from 'Common/Utils';
import {createStore} from 'redux';
import {ChatInitializedState} from 'Common/Constants';
import quiqOptions from 'utils/quiq';
import type {ChatState, Action, ChatInitializedStateType, Message} from 'types';

type ChatAction = {
  chatContainerHidden?: boolean,
  agentsAvailable?: boolean,
  initializedState?: ChatInitializedStateType,
  transcript?: Array<Message>,
  agentTyping?: boolean,
};

export const initialState = {
  chatContainerHidden: true,
  agentsAvailable: false,
  initializedState: ChatInitializedState.UNINITIALIZED,
  transcript: [],
  agentTyping: false,
  welcomeFormRegistered: !quiqOptions.welcomeForm,
};

const chat = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_CONTAINER_HIDDEN':
      return Object.assign({}, state, {
        chatContainerHidden: inStandaloneMode() ? false : action.chatContainerHidden,
      });
    case 'AGENTS_AVAILABLE':
      return Object.assign({}, state, {
        agentsAvailable: action.agentsAvailable,
      });
    case 'CHAT_INITIALIZED_STATE': {
      if (state.initializedState === ChatInitializedState.BURNED) {
        // One does not simply become unburned.
        return state;
      }

      return Object.assign({}, state, {initializedState: action.initializedState});
    }
    case 'UPDATE_TRANSCRIPT':
      return Object.assign({}, state, {transcript: action.transcript || []});
    case 'AGENT_TYPING':
      return Object.assign({}, state, {agentTyping: action.agentTyping});
    case 'WELCOME_FORM_REGISTERED':
      return Object.assign({}, state, {welcomeFormRegistered: true});
    case 'NEW_WEBCHAT_SESSION':
      // Reset state to initial state.
      // We keep the visibility state from before the new session, and we set initialized state to LOADING (while socket reconnects)
      return Object.assign(
        {},
        {...initialState},
        {
          chatContainerHidden: state.chatContainerHidden,
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

export const getAgentsAvailable = (state: ChatState): boolean => {
  return state.agentsAvailable;
};