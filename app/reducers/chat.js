// @flow
import {isIEorSafari, inStandaloneMode} from 'utils/utils';
import {createStore, combineReducers} from 'redux';
import {ChatInitializedState} from 'appConstants';
import QUIQ from 'utils/quiq';
import type {ChatState, Action, ChatInitializedStateType, Message} from 'types';

type ChatAction = {
  chatContainerHidden?: boolean,
  chatLauncherHidden?: boolean,
  initializedState?: ChatInitializedStateType,
  popped?: boolean,
  transcript?: Array<Message>,
  agentTyping?: boolean,
};

// When docking IE/Safari, we don't want to display the standard chat.
const launchingFromIEorSafari = () => isIEorSafari() && !inStandaloneMode();

const initialState = {
  chatContainerHidden: true,
  chatLauncherHidden: true,
  initializedState: ChatInitializedState.UNINITIALIZED,
  popped: false,
  transcript: [],
  agentTyping: false,
  welcomeFormRegistered: !QUIQ.WELCOME_FORM,
};

const reducer = (state: ChatState, action: Action & ChatAction) => {
  switch (action.type) {
    case 'CHAT_CONTAINER_HIDDEN':
      return Object.assign({}, state, {
        chatContainerHidden: launchingFromIEorSafari() ? true : action.chatContainerHidden,
      });
    case 'CHAT_LAUNCHER_HIDDEN':
      return Object.assign({}, state, {
        chatLauncherHidden: inStandaloneMode() ? true : action.chatLauncherHidden,
      });
    case 'CHAT_INITIALIZED_STATE': {
      if (state.initializedState === ChatInitializedState.BURNED) {
        // One does not simply become unburned.
        return state;
      }

      return Object.assign({}, state, {initializedState: action.initializedState});
    }

    case 'CHAT_POPPED': {
      return Object.assign({}, state, {
        chatContainerHidden: launchingFromIEorSafari() ? true : action.popped,
        popped: action.popped,
      });
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
          chatLauncherHidden: state.chatLauncherHidden,
          popped: state.popped,
          initializedState: ChatInitializedState.LOADING,
        },
      );
    default:
      return state;
  }
};

export default createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
