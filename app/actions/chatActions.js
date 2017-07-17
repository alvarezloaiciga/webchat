import {bindActionCreators} from 'redux';
import {isIEorSafari, inStandaloneMode} from 'utils/utils';
import type {ChatInitializedStateType, Message} from 'types';

export default dispatch =>
  bindActionCreators(
    {
      setChatHidden: (hidden: boolean) => {
        if (!hidden && !inStandaloneMode() && isIEorSafari()) return;

        return {
          type: 'CHAT_HIDDEN',
          hidden,
        };
      },
      setChatInitialized: (initializedState: ChatInitializedStateType) => ({
        type: 'CHAT_INITIALIZED_STATE',
        initializedState,
      }),
      setChatPopped: (popped: boolean) => ({
        type: 'CHAT_POPPED',
        popped,
      }),
      setAgentTyping: (agentTyping: boolean) => ({
        type: 'AGENT_TYPING',
        agentTyping,
      }),
      updateTranscript: (transcript: Array<Message>) => ({
        type: 'UPDATE_TRANSCRIPT',
        transcript,
      }),
      setWelcomeFormSubmitted: (welcomeFormSubmitted: boolean) => ({
        type: 'WELCOME_FORM_SUBMITTED',
        welcomeFormSubmitted,
      }),
    },
    dispatch,
  );
