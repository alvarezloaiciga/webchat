import type {ChatInitializedStateType, Message} from 'types';

export const setChatContainerHidden = (chatContainerHidden: boolean) => ({
  type: 'CHAT_CONTAINER_HIDDEN',
  chatContainerHidden,
});

export const setChatLauncherHidden = (chatLauncherHidden: boolean) => ({
  type: 'CHAT_LAUNCHER_HIDDEN',
  chatLauncherHidden,
});

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
