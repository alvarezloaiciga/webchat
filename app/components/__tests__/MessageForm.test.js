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
import {getMockMessage, getMockConfiguration} from 'utils/testHelpers';
import type {MessageFormProps} from '../MessageForm';
import {MenuItemKeys} from 'Common/Constants';
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
        latestConversationIsSpam: false,
        platformEvents: [],
        inputtingEmail: false,
        openFileBrowser: jest.fn(),
        muteSounds: false,
        setMuteSounds: jest.fn(),
        messageFieldFocused: false,
        setMessageFieldFocused: jest.fn(),
        setInputtingEmail: jest.fn(),
        configuration: getMockConfiguration({
          enableChatEmailTranscript: true,
          enableChatFileAttachments: true,
          enableEmojis: true,
          playSoundOnNewMessage: true,
          flashNotificationOnNewMessage: true,
          supportedAttachmentTypes: ['image/png,image/jpeg'],
          menuOptions: {
            customItems: [
              {
                id: 'Spidey',
                url: 'Earl',
                label: 'Babel',
                title: 'Danny McBridal',
                icon: 'Python',
                itemStyle: {},
                iconStyle: {},
              },
            ],
            offest: null,
          },
        }),
        chatIsSpam: false,
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

    describe('current convo is spam', () => {
      beforeEach(() => {
        wrapper.setProps({latestConversationIsSpam: true});
      });
      it('disables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(true);
      });
    });

    describe('entire transcript has no agent message', () => {
      beforeEach(() => {
        wrapper.setProps({transcript: [], chatIsSpam: false});
      });
      it('disables emailTranscript', () => {
        expect(isEmailTranscriptDisabled()).toBe(true);
      });
    });
  });
});
