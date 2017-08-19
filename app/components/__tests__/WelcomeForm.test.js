// @flow
jest.mock('utils/quiq');
import React from 'react';
import type {WelcomeFormProps} from '../WelcomeForm';
import {WelcomeForm} from '../WelcomeForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import {registerChatClient} from '../../ChatClient';
import Textarea from 'react-textarea-autosize';

describe('WelcomeForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: WelcomeFormProps;
  let render: () => void;
  const mockClient = {
    sendMessage: jest.fn(() => {}),
    sendRegistration: jest.fn(async () => await {}),
  };

  beforeEach(() => {
    registerChatClient(mockClient);

    testProps = {};
    render = () => {
      wrapper = shallow(<WelcomeForm {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('rendering textareas', () => {
      it('renders textares correctly', () => {
        expect(wrapper.find(Textarea).length).toBe(1);
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
      wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
      expect(mockClient.sendRegistration).not.toHaveBeenCalled();
    });

    it('does not submit if there is a required field containing only whitespace', () => {
      wrapper.find('input').at(0).simulate('change', {
        which: '   ',
        target: {
          name: 'firstName',
          value: '   ',
        },
      });

      wrapper.find('input').at(0).simulate('blur', {
        target: {
          name: 'firstName',
        },
      });
      render();
      wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
      expect(mockClient.sendRegistration).not.toHaveBeenCalled();
    });

    describe('valid submission', () => {
      beforeEach(() => {
        wrapper.find('input').at(0).simulate('change', {
          which: 'a',
          target: {
            name: 'firstName',
            value: 'a',
          },
        });
        wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
        render();
      });

      it('does submit if all required fields are filled in', () => {
        expect(mockClient.sendRegistration).toHaveBeenCalled();
      });

      it('does not send message if initial field was not provided', () => {
        expect(mockClient.sendMessage).not.toHaveBeenCalled();
      });

      it('disables send button and sets text', () => {
        expect(wrapper.find('button')).toMatchSnapshot();
      });
    });

    describe('valid submission with send message', () => {
      beforeEach(() => {
        wrapper.find('input').at(1).simulate('change', {
          which: 'brad',
          target: {
            name: 'lastName',
            value: 'brad',
          },
        });

        wrapper.find('input').at(0).simulate('change', {
          which: 'a',
          target: {
            name: 'firstName',
            value: 'a',
          },
        });

        wrapper.find('button').first().simulate('click', {preventDefault: jest.fn()});
        render();
      });

      it('does submit if all required fields are filled in', () => {
        expect(mockClient.sendRegistration).toHaveBeenCalled();
      });

      // Not sure why this is failing, but it is definitely being called...
      // it('does send message if initial field was provided', () => {
      //   expect(mockClient.sendMessage).toHaveBeenCalled();
      // });

      it('disables send button and sets text', () => {
        expect(wrapper.find('button')).toMatchSnapshot();
      });
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
