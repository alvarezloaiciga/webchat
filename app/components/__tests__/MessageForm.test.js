// @flow
jest.mock('quiq-chat');
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');
jest.mock('components/EmojiTextArea');
jest.mock('services/Postmaster');

import React from 'react';
import {MessageForm} from '../MessageForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import {getMockMessage} from 'utils/testHelpers';
import type {MessageFormProps} from '../MessageForm';
import {MenuItemKeys} from 'Common/Constants';
import * as Utils from 'Common/Utils';
import QuiqChatClient from 'quiq-chat';

describe('MessageForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MessageFormProps;
  let instance: any;
  let render: () => void;

  beforeEach(() => {
    QuiqChatClient.sendTextMessage = jest.fn();
    QuiqChatClient.updateMessagePreview = jest.fn();

    render = () => {
      testProps = {
        transcript: [getMockMessage(), getMockMessage(1)],
        agentEndedConversation: false,
        platformEvents: [],
        inputtingEmail: false,
        openFileBrowser: jest.fn(),
        muteSounds: false,
        setMuteSounds: jest.fn(),
        messageFieldFocused: false,
        setMessageFieldFocused: jest.fn(),
        setInputtingEmail: jest.fn(),
        configuration: {
          enableChatEmailTranscript: true,
          enableChatFileAttachments: true,
          supportedAttachmentTypes: ['image/png,image/jpeg'],
          enableEmojis: true,
          playSoundOnNewMessage: true,
          flashNotificationOnNewMessage: true,
        },
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
    it('handling textarea onchange', () => {
      instance.handleTextChanged('foo');
      expect(wrapper.state('hasText')).toBe(true);
    });
  });

  describe('emailTranscript', () => {
    const isEmailTranscriptDisabled = () =>
      wrapper
        .find('Menu')
        .prop('items')
        .find(i => i.id === MenuItemKeys.EMAIL_TRANSCRIPT).disabled;

    beforeEach(() => {
      render();
      wrapper.setProps({agentEndedConversation: true});
      expect(isEmailTranscriptDisabled()).toBe(false);
    });

    describe('when email is disabled for current conversation', () => {
      beforeEach(() => {
        // $FlowIssue
        Utils.enableEmailForCurrentConversation.mockReturnValueOnce(false);
      });
      it('disables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(true);
      });
    });
  });
});
