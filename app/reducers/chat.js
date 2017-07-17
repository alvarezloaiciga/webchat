// @flow
import {createStore} from 'redux';
import {ChatInitializedState} from 'appConstants';
import QUIQ from 'utils/quiq';
import type {ChatState, Action, ChatInitializedStateType, Message} from 'types';

type ChatAction = {
  hidden?: boolean,
  initializedState?: ChatInitializedStateType,
  popped?: boolean,
  transcript?: Array<Message>,
  agentTyping?: boolean,
  welcomeFormSubmitted?: boolean,
};

const reducer = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_HIDDEN': {
      const newState = Object.assign({}, state);
      newState.hidden = action.hidden;
      return newState;
    }
    case 'CHAT_INITIALIZED_STATE': {
      const newState = Object.assign({}, state);
      newState.initializedState = action.initializedState;
      return newState;
    }
    case 'CHAT_POPPED': {
      const newState = Object.assign({}, state);
      newState.popped = action.popped;
      return newState;
    }
    case 'UPDATE_TRANSCRIPT': {
      const newState = Object.assign({}, state);
      newState.transcript = action.transcript || [];
      return newState;
    }
    case 'AGENT_TYPING': {
      const newState = Object.assign({}, state);
      newState.agentTyping = action.agentTyping;
      return newState;
    }
    case 'WELCOME_FORM_SUBMITTED': {
      const newState = Object.assign({}, state);
      newState.welcomeFormSubmitted = action.welcomeFormSubmitted;
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default createStore(reducer, {
  hidden: true,
  initializedState: ChatInitializedState.UNINITIALIZED,
  popped: false,
  transcript: [],
  agentTyping: false,
  welcomeFormSubmitted: !QUIQ.WELCOME_FORM,
});
