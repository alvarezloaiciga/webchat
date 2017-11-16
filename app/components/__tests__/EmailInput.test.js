// @flow
jest.mock('quiq-chat');
jest.mock('Common/QuiqOptions');

// @flow
import React from 'react';
import {UserEmailKey} from 'Common/Constants';
import type {EmailInputProps} from '../EmailInput';
import EmailInput from '../EmailInput';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import QuiqChatClient from 'quiq-chat';

describe('EmailInput component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let testProps: EmailInputProps;
  let render: () => void;
  QuiqChatClient.emailTranscript = jest.fn();

  beforeEach(() => {
    testProps = {
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
    };
    render = () => {
      wrapper = shallow(<EmailInput {...testProps} />);
      instance = wrapper.instance();
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('input value', () => {
    it('retrieves the intial value from localStorage when available', () => {
      const email = 'andrew.jenkins@goquiq.com';
      localStorage.setItem(`${UserEmailKey}_Bob`, btoa(email));
      render();
      expect(wrapper.find('Input').prop('initialValue')).toBe(email);
      localStorage.clear();
    });

    it("doesn't call onsubmit with invalid emails", () => {
      render();
      instance.input = {
        getValue: () => 'invalidEmail',
      };
      wrapper.find('[data-test="submitButton"]').simulate('click');
      expect(testProps.onSubmit).not.toBeCalled();
    });

    it('calls onsubmit with valid emails', () => {
      render();
      instance.input = {
        getValue: () => 'andrew.jenkins@goquiq.com',
      };
      wrapper.find('[data-test="submitButton"]').simulate('click');
      expect(testProps.onSubmit).toBeCalled();
    });
  });
});
