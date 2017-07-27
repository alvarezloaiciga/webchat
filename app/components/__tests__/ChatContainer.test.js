// @flow
jest.mock('utils/quiq');
jest.mock('../../ChatClient');
jest.mock('utils/utils');
import React from 'react';
import {ChatContainer} from '../ChatContainer';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import QUIQ from 'utils/quiq';
import type {ChatContainerProps} from '../ChatContainer';

jest.useFakeTimers();

describe('ChatContainer component', () => {
  let wrapper: ShallowWrapper;
  let testProps: ChatContainerProps;
  let render: () => void;

  beforeEach(() => {
    QUIQ.WELCOME_FORM = undefined;
    testProps = {
      chatContainerHidden: false,
      welcomeFormRegistered: true,
      initializedState: 'initialized',
    };

    render = () => {
      wrapper = shallow(<ChatContainer {...testProps} />);
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

    describe('when burned', () => {
      it('renders properly', () => {
        testProps.initializedState = 'burned';
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

  describe('when chatContainerHidden is true', () => {
    it('returns null', () => {
      testProps.chatContainerHidden = true;
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('welcome form', () => {
    describe('when welcome form has not been submitted', () => {
      it('renders welcome form', () => {
        testProps.welcomeFormRegistered = false;
        render();
        expect(wrapper.find('WelcomeForm').length).toBe(1);
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
});
