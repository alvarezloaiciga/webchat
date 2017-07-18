// @flow
import {isIEorSafari, inStandaloneMode} from 'utils/utils';
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

// When docking IE/Safari, we don't want to display the standard chat.
const launchingFromIEorSafari = () => isIEorSafari() && !inStandaloneMode();

const reducer = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_HIDDEN':
      return Object.assign({}, state, {hidden: launchingFromIEorSafari() ? true : action.hidden});
    case 'CHAT_INITIALIZED_STATE':
      return Object.assign({}, state, {initializedState: action.initializedState});
    case 'CHAT_POPPED': {
      return Object.assign({}, state, {
        hidden: launchingFromIEorSafari() ? true : action.popped,
        popped: action.popped,
      });
    }
    case 'UPDATE_TRANSCRIPT':
      return Object.assign({}, state, {transcript: action.transcript || []});
    case 'AGENT_TYPING':
      return Object.assign({}, state, {agentTyping: action.agentTyping});
    case 'WELCOME_FORM_SUBMITTED':
      return Object.assign({}, state, {welcomeFormSubmitted: action.welcomeFormSubmitted});
    default:
      return state;
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
