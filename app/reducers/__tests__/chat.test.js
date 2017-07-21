// @flow
jest.mock('utils/utils');
import chat from '../chat';
import {getMockMessage} from 'utils/testHelpers';
import {isIEorSafari, inStandaloneMode} from 'utils/utils';

describe('chat reducers', () => {
  afterEach(() => {
    (isIEorSafari: any).mockReset();
    (inStandaloneMode: any).mockReset();
  });

  describe('CHAT_CONTAINER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().chatContainerHidden).toBe(true);
      chat.dispatch({type: 'CHAT_CONTAINER_HIDDEN', chatContainerHidden: false});
      expect(chat.getState().chatContainerHidden).toBe(false);
    });

    it('always sets chatContainerHidden to true in IE/Safari', () => {
      (isIEorSafari: any).mockReturnValue(true);
      chat.dispatch({type: 'CHAT_CONTAINER_HIDDEN', chatContainerHidden: false});
      expect(chat.getState().chatContainerHidden).toBe(true);
    });
  });

  describe('CHAT_LAUNCHER_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().chatLauncherHidden).toBe(true);
      chat.dispatch({type: 'CHAT_LAUNCHER_HIDDEN', chatLauncherHidden: false});
      expect(chat.getState().chatLauncherHidden).toBe(false);
    });

    it('always sets chatLauncherHidden to true in standalone mode', () => {
      (inStandaloneMode: any).mockReturnValue(true);
      chat.dispatch({type: 'CHAT_LAUNCHER_HIDDEN', chatLauncherHidden: false});
      expect(chat.getState().chatLauncherHidden).toBe(true);
    });
  });

  describe('CHAT_INITIALIZED_STATE', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().initializedState).toBe('uninitialized');
      chat.dispatch({type: 'CHAT_INITIALIZED_STATE', initializedState: 'initialized'});
      expect(chat.getState().initializedState).toBe('initialized');
    });
  });

  describe('CHAT_POPPED', () => {
    it('updates state with the new value', () => {
      chat.dispatch({type: 'CHAT_POPPED', popped: true});
      expect(chat.getState().popped).toBe(true);
      expect(chat.getState().chatContainerHidden).toBe(true);

      chat.dispatch({type: 'CHAT_POPPED', popped: false});
      expect(chat.getState().popped).toBe(false);
      expect(chat.getState().chatContainerHidden).toBe(false);
    });

    it('always sets chatContainerHidden to true in IE/Safari', () => {
      (isIEorSafari: any).mockReturnValue(true);
      chat.dispatch({type: 'CHAT_POPPED', popped: false});
      expect(chat.getState().popped).toBe(false);
      expect(chat.getState().chatContainerHidden).toBe(true);
    });
  });

  describe('UPDATE_TRANSCRIPT', () => {
    it('updates state with the new value', () => {
      const transcript = [getMockMessage()];
      expect(chat.getState().transcript).toEqual([]);
      chat.dispatch({type: 'UPDATE_TRANSCRIPT', transcript});
      expect(chat.getState().transcript).toEqual(transcript);
    });
  });

  describe('AGENT_TYPING', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().agentTyping).toBe(false);
      chat.dispatch({type: 'AGENT_TYPING', agentTyping: true});
      expect(chat.getState().agentTyping).toBe(true);
    });
  });

  describe('WELCOME_FORM_REGISTERED', () => {
    it('updates state with the new value', () => {
      chat.dispatch({type: 'WELCOME_FORM_REGISTERED'});
      expect(chat.getState().welcomeFormRegistered).toBe(true);
    });
  });
});
