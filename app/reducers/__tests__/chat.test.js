// @flow
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');

import chat, {initialState} from '../chat';
import {getMockMessage, getMockConfiguration} from 'utils/testHelpers';
import {inStandaloneMode} from 'Common/Utils';

describe('chat reducers', () => {
  afterEach(() => {
    (inStandaloneMode: any).mockReset();
  });

  describe('CHAT_CONTAINER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {
          type: 'CHAT_CONTAINER_HIDDEN',
          chatContainerHidden: false,
        }).chatContainerHidden,
      ).toBe(false);
    });
  });

  describe('CHAT_LAUNCHER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {
          type: 'CHAT_LAUNCHER_HIDDEN',
          chatLauncherHidden: false,
        }).chatLauncherHidden,
      ).toBe(false);
    });

    it('always sets chatLauncherHidden to true in standalone mode', () => {
      (inStandaloneMode: any).mockReturnValue(true);
      expect(
        chat(initialState, {
          type: 'CHAT_LAUNCHER_HIDDEN',
          chatLauncherHidden: false,
        }).chatLauncherHidden,
      ).toBe(true);
    });
  });

  describe('CHAT_INITIALIZED_STATE', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {
          type: 'CHAT_INITIALIZED_STATE',
          initializedState: 'initialized',
        }).initializedState,
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

  describe('AGENTS_AVAILABLE', () => {
    it('updates state with the new value', () => {
      expect(chat(initialState, {type: 'AGENTS_AVAILABLE', popped: true})).toMatchSnapshot();
      expect(chat(initialState, {type: 'AGENTS_AVAILABLE', popped: false})).toMatchSnapshot();
    });
  });

  describe('UPDATE_TYPING_AUTHOR', () => {
    it('updates state with the new value', () => {
      expect(
        chat(initialState, {
          type: 'AGENT_TYPING',
          author: {
            authorType: 'User',
            authorDisplayName: 'Foo',
            authorProfilePicture: 'https://pics.com/pic.png',
          },
        }),
      ).toMatchSnapshot();
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
    const mock = getMockMessage();
    it('updates state with initial state merged with current visibility state and "initialized" set to "LOADING"', () => {
      const mutatedState = {
        welcomeFormRegistered: true,
        initializedState: 'initialized',
        chatContainerHidden: false,
        popped: false,
        chatLauncherHidden: false,
        transcript: {[mock.id]: mock},
        isAgentAssigned: false,
        typingAuthor: null,
        agentsAvailable: true,
        platformEvents: {},
        messageFieldFocused: false,
        configuration: getMockConfiguration(),
        chatIsSpam: true,
        inputtingEmail: false,
        attachmentErrors: [],
        persistentData: {},
        windowScrollLockEnabled: true,
      };

      expect(chat(mutatedState, {type: 'NEW_WEBCHAT_SESSION'})).toMatchSnapshot();
    });
  });
});
