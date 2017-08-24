// @flow
jest.mock('utils/utils');
import chat, {initialState} from '../chat';
import {getMockMessage} from 'utils/testHelpers';
import {inStandaloneMode} from 'utils/utils';

describe('chat reducers', () => {
  afterEach(() => {
    (inStandaloneMode: any).mockReset();
  });

  describe('CHAT_CONTAINER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {type: 'CHAT_CONTAINER_HIDDEN', chatContainerHidden: false})
          .chatContainerHidden,
      ).toBe(false);
    });
  });

  describe('CHAT_LAUNCHER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {type: 'CHAT_LAUNCHER_HIDDEN', chatLauncherHidden: false})
          .chatLauncherHidden,
      ).toBe(false);
    });

    it('always sets chatLauncherHidden to true in standalone mode', () => {
      (inStandaloneMode: any).mockReturnValue(true);
      expect(
        chat(initialState, {type: 'CHAT_LAUNCHER_HIDDEN', chatLauncherHidden: false})
          .chatLauncherHidden,
      ).toBe(true);
    });
  });

  describe('CHAT_INITIALIZED_STATE', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {type: 'CHAT_INITIALIZED_STATE', initializedState: 'initialized'})
          .initializedState,
      ).toBe('initialized');
    });

    describe('when already burned', () => {
      it('does not update state', () => {
        expect(
          chat(Object.assign({}, initialState, {initializedState: 'burned'}), {
            type: 'CHAT_INITIALIZED_STATE',
            initializedState: 'initialized',
          }).initializedState,
        ).toBe('burned');
      });
    });
  });

  describe('CHAT_POPPED', () => {
    it('updates state with the new value', () => {
      expect(chat(initialState, {type: 'CHAT_POPPED', popped: true})).toMatchSnapshot();
      expect(chat(initialState, {type: 'CHAT_POPPED', popped: false})).toMatchSnapshot();
    });
  });

  describe('UPDATE_TRANSCRIPT', () => {
    it('updates state with the new value', () => {
      const transcript = [getMockMessage()];
      expect(chat(initialState, {type: 'UPDATE_TRANSCRIPT', transcript}).transcript).toEqual(
        transcript,
      );
    });
  });

  describe('AGENT_TYPING', () => {
    it('updates state with the new value', () => {
      expect(chat(initialState, {type: 'AGENT_TYPING', agentTyping: true}).agentTyping).toBe(true);
    });
  });

  describe('WELCOME_FORM_REGISTERED', () => {
    it('updates state with the new value', () => {
      expect(chat(initialState, {type: 'WELCOME_FORM_REGISTERED'}).welcomeFormRegistered).toBe(
        true,
      );
    });
  });

  describe('NEW_WEBCHAT_SESSION', () => {
    it('updates state with initial state merged with current visibility state and "initialized" set to "LOADING"', () => {
      const mutatedState = {
        welcomeFormRegistered: true,
        initializedState: 'initialized',
        chatContainerHidden: false,
        popped: false,
        chatLauncherHidden: false,
        transcript: [getMockMessage()],
        agentTyping: true,
      };

      expect(chat(mutatedState, {type: 'NEW_WEBCHAT_SESSION'})).toMatchSnapshot();
    });
  });
});
