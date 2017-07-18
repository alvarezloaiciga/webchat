// @flow
jest.mock('utils/quiq');
jest.mock('../../ChatClient');
jest.mock('utils/utils');
import React from 'react';
import {ChatContainer} from '../ChatContainer';
import {getMockMessage} from 'utils/testHelpers';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import QUIQ from 'utils/quiq';
import type {ChatContainerProps} from '../ChatContainer';
import {inStandaloneMode} from 'utils/utils';

jest.useFakeTimers();

describe('ChatContainer component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let testProps: ChatContainerProps;
  let render: () => void;

  beforeEach(() => {
    QUIQ.WELCOME_FORM = undefined;
    testProps = {
      hidden: false,
      transcript: [getMockMessage(), getMockMessage(1)],
      welcomeFormSubmitted: true,
      initializedState: 'initialized',
      setChatHidden: jest.fn(),
      setChatInitialized: jest.fn(),
      setWelcomeFormSubmitted: jest.fn(),
      setAgentTyping: jest.fn(),
      updateTranscript: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<ChatContainer {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();
      wrapper.update();
    };
  });

  describe('initializedState', () => {
    describe('when initialized', () => {
      it('renders properly', () => {
        testProps.initializedState = 'initialized';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when uninitialized', () => {
      it('renders properly', () => {
        testProps.initializedState = 'uninitialized';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when loading', () => {
      it('renders properly', () => {
        testProps.initializedState = 'loading';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when errored', () => {
      it('renders properly', () => {
        testProps.initializedState = 'error';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when disconnected', () => {
      it('renders properly', () => {
        testProps.initializedState = 'disconnected';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe('welcome form', () => {
    describe('when welcome form has not been submitted', () => {
      it('renders welcome form', () => {
        testProps.welcomeFormSubmitted = false;
        render();
        expect(wrapper.find('Connect(WelcomeForm)').length).toBe(1);
      });
    });
  });

  describe('custom launcher', () => {
    it('appends the hasCustomLauncher class', () => {
      QUIQ.CUSTOM_LAUNCH_BUTTONS = ['.customButton'];
      render();
      expect(wrapper.hasClass('hasCustomLauncher')).toBe(true);
    });
  });

  describe('standalone mode', () => {
    it('inits on mount', () => {
      (inStandaloneMode: any).mockReturnValue(true);
      render();
      expect(testProps.setChatHidden).toBeCalledWith(false);
      expect(testProps.setChatInitialized).toBeCalledWith('loading');
      expect(wrapper.hasClass('standaloneMode')).toBe(true);
    });
  });

  describe('handleAgentTyping', () => {
    it('handles agent typing', () => {
      render();
      instance.handleAgentTyping(true);
      expect(testProps.setAgentTyping).toBeCalledWith(true);
      jest.runTimersToTime(11000);
      expect(testProps.setAgentTyping).toBeCalledWith(false);
    });
  });
});
