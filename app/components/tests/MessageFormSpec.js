// @flow

import React from 'react';
import keycodes from 'keycodes';
import MessageForm from '../MessageForm';
import { addMessage } from 'network/chat';
import { shallow } from 'enzyme';
import type { ShallowWrapper } from 'enzyme';

jest.mock('network/chat');

describe('MessageForm component', () => {
  let wrapper:ShallowWrapper;
  let instance: any;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<MessageForm />);
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
      wrapper.setState({ text: 'Tool Time' });
      expect(wrapper.find('TextareaAutosize').prop('value')).toBe('Tool Time');
    });

    describe('pressing enter', () => {
      beforeEach(() => {
        wrapper.setState({ text: 'OOHOOOHOOH' });
        instance.handleKeyDown({ keyCode: keycodes.enter, preventDefault: jest.fn() });
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
});
