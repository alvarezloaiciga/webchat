// @flow
jest.mock('utils/utils');
import * as chatActions from '../chatActions';
import {getMockMessage} from 'utils/testHelpers';
import {isIEorSafari} from 'utils/utils';

describe('chatActions', () => {
  describe('setChatHidden', () => {
    it('builds an action', () => {
      expect(chatActions.setChatHidden(true)).toMatchSnapshot();
    });

    describe('when in IE or Safari, not in standalone, and not hidden', () => {
      it('does not build an action', () => {
        (isIEorSafari: any).mockReturnValue(true);
        expect(chatActions.setChatHidden(false)).toBe(undefined);
      });
    });
  });

  describe('setChatInitialized', () => {
    it('builds an action', () => {
      expect(chatActions.setChatInitialized('initialized')).toMatchSnapshot();
    });
  });

  describe('setChatPopped', () => {
    it('builds an action', () => {
      expect(chatActions.setChatPopped(true)).toMatchSnapshot();
    });
  });

  describe('setAgentTyping', () => {
    it('builds an action', () => {
      expect(chatActions.setAgentTyping(true)).toMatchSnapshot();
    });
  });

  describe('updateTranscript', () => {
    it('builds an action', () => {
      expect(chatActions.updateTranscript([getMockMessage()])).toMatchSnapshot();
    });
  });

  describe('setWelcomeFormSubmitted', () => {
    it('builds an action', () => {
      expect(chatActions.setWelcomeFormSubmitted(true)).toMatchSnapshot();
    });
  });
});
