// @flow
jest.mock('utils/utils');
jest.mock('quiq-chat');
import React from 'react';
import keycodes from 'keycodes';
import MessageForm from '../MessageForm';
import {addMessage} from 'quiq-chat';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import type {MessageFormProps} from '../MessageForm';

describe('MessageForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MessageFormProps;
  let instance: any;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      testProps = {
        agentTyping: false,
      };
      wrapper = shallow(<MessageForm {...testProps} />);
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

  describe('adding text', () => {
    it('adds text', () => {
      wrapper.setState({text: 'Tool Time'});
      expect(wrapper.find('TextareaAutosize').prop('value')).toBe('Tool Time');
    });

    describe('pressing enter', () => {
      beforeEach(() => {
        wrapper.setState({text: 'OOHOOOHOOH'});
        instance.handleKeyDown({keyCode: keycodes.enter, preventDefault: jest.fn()});
      });

      it('adds text', () => {
        expect(addMessage).toBeCalledWith('OOHOOOHOOH');
      });

      it('clears message form', () => {
        wrapper.update();
        expect(wrapper.find('TextareaAutosize').prop('value')).toBe('');
      });
    });
  });

  describe('agentTyping', () => {
    it('shows typing indicator', () => {
      render();
      wrapper.setProps({agentTyping: true});
      expect(wrapper).toMatchSnapshot();
    });
  });
});
