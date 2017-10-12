// @flow
jest.mock('quiq-chat');
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');

import React from 'react';
import {MessageForm} from '../MessageForm';
import {shallow, mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import type {MessageFormProps} from '../MessageForm';
import QuiqChatClient from 'quiq-chat';

describe('MessageForm component', () => {
  let wrapper: ReactWrapper;
  let testProps: MessageFormProps;
  let instance: any;
  let render: () => void;

  beforeEach(() => {
    QuiqChatClient.sendMessage = jest.fn();
    QuiqChatClient.updateMessagePreview = jest.fn();

    render = () => {
      testProps = {
        agentTyping: false,
        agentEndedConversation: false,
      };
      wrapper = mount(<MessageForm {...testProps} />);
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
    it('handling textarea onchange', () => {
      instance.handleTextChanged('foo');
      expect(wrapper.state('hasText')).toBe(true);
    });

    describe('pressing enter', () => {
      beforeEach(() => {
        instance.handleReturnKey();
      });

      it('adds text', () => {
        expect(QuiqChatClient.sendMessage).toBeCalled();
      });

      it('clears message form', () => {
        wrapper.update();
        expect(instance.textArea.setText).toBeCalledWith('');
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
