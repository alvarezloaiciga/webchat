import {isIEorSafari, inStandaloneMode} from 'utils/utils';
import type {ChatInitializedStateType, Message} from 'types';

export const setChatHidden = (hidden: boolean) => {
  if (!hidden && !inStandaloneMode() && isIEorSafari()) return;

  return {
    type: 'CHAT_HIDDEN',
    hidden,
  };
};

export const setChatInitialized = (initializedState: ChatInitializedStateType) => ({
  type: 'CHAT_INITIALIZED_STATE',
  initializedState,
});

export const setChatPopped = (popped: boolean) => ({
  type: 'CHAT_POPPED',
  popped,
});

export const setAgentTyping = (agentTyping: boolean) => ({
  type: 'AGENT_TYPING',
  agentTyping,
});

export const updateTranscript = (transcript: Array<Message>) => ({
  type: 'UPDATE_TRANSCRIPT',
  transcript,
});

export const setWelcomeFormSubmitted = (welcomeFormSubmitted: boolean) => ({
  type: 'WELCOME_FORM_SUBMITTED',
  welcomeFormSubmitted,
});
