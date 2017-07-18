// @flow
import chat from '../chat';
import {getMockMessage} from 'utils/testHelpers';

describe('chat reducers', () => {
  describe('CHAT_HIDDEN', () => {
    it('updates state with the new value', () => {
      expect(chat.dispatch({type: 'CHAT_HIDDEN', hidden: true}).hidden).toBe(true);
    });
  });
  describe('CHAT_INITIALIZED_STATE', () => {
    it('updates state with the new value', () => {
      expect(
        chat.dispatch({type: 'CHAT_INITIALIZED_STATE', initializedState: 'initialized'})
          .initializedState,
      ).toBe('initialized');
    });
  });
  describe('CHAT_POPPED', () => {
    it('updates state with the new value', () => {
      expect(chat.dispatch({type: 'CHAT_POPPED', popped: true}).popped).toBe(true);
    });
  });
  describe('UPDATE_TRANSCRIPT', () => {
    it('updates state with the new value', () => {
      const transcript = [getMockMessage()];
      expect(chat.dispatch({type: 'UPDATE_TRANSCRIPT', transcript}).transcript).toEqual(transcript);
    });
  });
  describe('AGENT_TYPING', () => {
    it('updates state with the new value', () => {
      expect(chat.dispatch({type: 'AGENT_TYPING', agentTyping: true}).agentTyping).toBe(true);
    });
  });
  describe('WELCOME_FORM_SUBMITTED', () => {
    it('updates state with the new value', () => {
      expect(
        chat.dispatch({type: 'WELCOME_FORM_SUBMITTED', welcomeFormSubmitted: false})
          .welcomeFormSubmitted,
      ).toBe(false);
    });
  });
});
