// @flow
jest.mock('utils/quiq');
import React from 'react';
import type {WelcomeFormProps} from '../WelcomeForm';
import WelcomeForm from '../WelcomeForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import {registerChatClient} from '../../ChatClient';

describe('WelcomeForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: WelcomeFormProps;
  let render: () => void;
  const mockClient = {
    sendRegistration: jest.fn(async () => await {}),
  };

  beforeEach(() => {
    registerChatClient(mockClient);

    testProps = {
      onFormSubmit: jest.fn(),
      onDock: jest.fn(),
      onMinimize: jest.fn(),
      onPop: jest.fn(),
      onApiError: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<WelcomeForm {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders error message if formValidationError state is true', () => {
      wrapper.setState({formValidationError: false});
      expect(wrapper).toMatchSnapshot();
    });

    it('does not render error message with formValidationError false', () => {
      wrapper.setState({formValidationError: true});
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('filling out form and submitting', () => {
    beforeEach(() => {
      render();
    });

    it('does not submit if there is a required field left blank', () => {
      wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
      expect(mockClient.sendRegistration).not.toHaveBeenCalled();
    });

    it('does submit if all required fields are filled in', () => {
      wrapper.find('input').at(0).simulate('change', {
        which: 'a',
        target: {
          name: 'firstName',
          value: 'a',
        },
      });
      wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
      expect(mockClient.sendRegistration).toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      render();
    });

    it('sets validationError state to true if a required field is left blank', () => {
      // $FlowIssue - flow think instance() returns a generic Component
      wrapper.instance().validateFormInput();
      expect(wrapper.state('formValidationError')).toBe(true);
    });
  });
});
