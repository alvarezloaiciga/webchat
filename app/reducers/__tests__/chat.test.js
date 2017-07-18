// @flow
jest.mock('utils/utils');
import chat from '../chat';
import {getMockMessage} from 'utils/testHelpers';
import {isIEorSafari} from 'utils/utils';

describe('chat reducers', () => {
  afterEach(() => {
    (isIEorSafari: any).mockReset();
  });

  describe('CHAT_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().hidden).toBe(true);
      chat.dispatch({type: 'CHAT_HIDDEN', hidden: false});
      expect(chat.getState().hidden).toBe(false);
    });

    it('always sets hidden to true in IE/Safari', () => {
      (isIEorSafari: any).mockReturnValue(true);
      chat.dispatch({type: 'CHAT_HIDDEN', hidden: false});
      expect(chat.getState().hidden).toBe(true);
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
      expect(chat.getState().hidden).toBe(true);

      chat.dispatch({type: 'CHAT_POPPED', popped: false});
      expect(chat.getState().popped).toBe(false);
      expect(chat.getState().hidden).toBe(false);
    });

    it('always sets hidden to true in IE/Safari', () => {
      (isIEorSafari: any).mockReturnValue(true);
      chat.dispatch({type: 'CHAT_POPPED', popped: false});
      expect(chat.getState().popped).toBe(false);
      expect(chat.getState().hidden).toBe(true);
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

  describe('WELCOME_FORM_SUBMITTED', () => {
    it('updates state with the new value', () => {
      expect(chat.getState().welcomeFormSubmitted).toBe(true);
      chat.dispatch({type: 'WELCOME_FORM_SUBMITTED', welcomeFormSubmitted: false});
      expect(chat.getState().welcomeFormSubmitted).toBe(false);
    });
  });
});
