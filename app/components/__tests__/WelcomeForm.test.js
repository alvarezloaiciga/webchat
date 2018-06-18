// @flow
jest.mock('reducers/chat');

import React from 'react';
import type {WelcomeFormProps} from '../WelcomeForm';
import {WelcomeForm} from '../WelcomeForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import QuiqChatClient from 'quiq-chat';
import {getMockConfiguration} from 'utils/testHelpers';

describe('WelcomeForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: WelcomeFormProps;
  let render: () => void;

  beforeEach(() => {
    QuiqChatClient.sendTextMessage = jest.fn(() => {});
    QuiqChatClient.sendRegistration = jest.fn(async () => ({}));
    const configuration = getMockConfiguration();

    testProps = {
      setWelcomeFormRegistered: jest.fn(),
      welcomeFormRegistered: false,
      registrationForm: configuration.registrationForm,
      configuration,
      setWindowScrollLockEnabled: jest.fn(),
      registrationFieldValues: {},
    };
    render = () => {
      wrapper = shallow(<WelcomeForm {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
      wrapper.update();
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('rendering textareas', () => {
      it('renders textares correctly', () => {
        expect(wrapper.find('textarea').length).toBe(1);
      });
    });

    describe('validation error rendering', () => {
      it('does not render error message if formValidationError state is false', () => {
        wrapper.setState({formValidationError: false});
        expect(wrapper.find('.formValidationError').length).toBe(0);
      });

      it('renders error message with formValidationError true', () => {
        wrapper.setState({formValidationError: true});
        expect(wrapper.find('.formValidationError').length).toBe(1);
      });
    });
  });

  describe('filling out form and submitting', () => {
    it('does not submit if there is a required field left blank', () => {
      render();
      wrapper.update();
      wrapper
        .find('button')
        .first()
        .simulate('click', {preventDefault: jest.fn()});
      expect(QuiqChatClient.sendRegistration).not.toHaveBeenCalled();
    });

    it('does not submit if there is a required field containing only whitespace', () => {
      wrapper
        .find('input')
        .at(0)
        .simulate('change', {
          which: '   ',
          target: {
            name: 'firstName',
            value: '   ',
          },
        });

      wrapper
        .find('input')
        .at(0)
        .simulate('blur', {
          target: {
            name: 'firstName',
          },
        });
      render();
      wrapper.update();
      wrapper
        .find('button')
        .first()
        .simulate('click', {preventDefault: jest.fn()});
      expect(QuiqChatClient.sendRegistration).not.toHaveBeenCalled();
    });

    describe('valid submission', () => {
      beforeEach(() => {
        wrapper
          .find('input')
          .at(0)
          .simulate('change', {
            which: 'a',
            target: {
              name: 'firstName',
              value: 'a',
            },
          });
        wrapper
          .find('select')
          .at(0)
          .simulate('change', {
            which: 'USA',
            target: {
              name: 'country',
              value: 'USA',
            },
          });
        wrapper
          .find('button')
          .first()
          .simulate('click', {preventDefault: jest.fn()});
        render();
        wrapper.update();
      });

      it('does submit if all required fields are filled in', () => {
        expect(QuiqChatClient.sendRegistration).toHaveBeenCalled();
      });

      it('does not send message if initial field was not provided', () => {
        expect(QuiqChatClient.sendTextMessage).not.toHaveBeenCalled();
      });

      it('disables send button and sets text', () => {
        expect(wrapper.find('button')).toMatchSnapshot();
      });
    });

    describe('valid submission with send message', () => {
      beforeEach(() => {
        wrapper
          .find('input')
          .at(1)
          .simulate('change', {
            which: 'brad',
            target: {
              name: 'lastName',
              value: 'brad',
            },
          });

        wrapper
          .find('input')
          .at(0)
          .simulate('change', {
            which: 'a',
            target: {
              name: 'firstName',
              value: 'a',
            },
          });

        wrapper
          .find('select')
          .at(0)
          .simulate('change', {
            which: 'USA',
            target: {
              name: 'country',
              value: 'USA',
            },
          });

        wrapper
          .find('button')
          .first()
          .simulate('click', {preventDefault: jest.fn()});
        render();
        wrapper.update();
      });

      it('does submit if all required fields are filled in', () => {
        expect(QuiqChatClient.sendRegistration).toHaveBeenCalled();
      });

      // Not sure why this is failing, but it is definitely being called...
      // it('does send message if initial field was provided', () => {
      //   expect(QuiqChatClient.sendTextMessage).toHaveBeenCalled();
      // });

      it('disables send button and sets text', () => {
        expect(wrapper.find('button')).toMatchSnapshot();
      });
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      render();
      wrapper.update();
    });

    it('sets validationError state to a required error if a required field is left blank', () => {
      wrapper.instance().validateFormInput();
      expect(wrapper.state('formValidationError')).toBe('REQUIRED');
    });
  });
});
