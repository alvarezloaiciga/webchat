// @flow
jest.mock('quiq-chat');
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');
jest.mock('components/EmojiTextArea');
jest.mock('services/Postmaster');
jest.mock('reducers/chat');

import React from 'react';
import {MessageForm} from '../MessageForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import {getMockMessage, getMockConfiguration} from 'utils/testHelpers';
import type {MessageFormProps} from '../MessageForm';
import {MenuItemKeys} from 'Common/Constants';
import QuiqChatClient from 'quiq-chat';
import * as Utils from 'Common/Utils';

describe('MessageForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MessageFormProps;
  let instance: any;
  let render: () => void;

  beforeEach(() => {
    QuiqChatClient.sendTextMessage = jest.fn();
    QuiqChatClient.updateMessagePreview = jest.fn();
    QuiqChatClient.checkForAgents = jest.fn(() => ({available: true}));

    render = () => {
      testProps = {
        transcript: [getMockMessage(), getMockMessage(1)],
        agentEndedConversation: false,
        agentsAvailableOrSubscribed: true,
        agentHasRespondedToLatestConversation: true,
        closedConversationCount: 1,
        lastClosedConversationIsSpam: false,
        platformEvents: [],
        inputtingEmail: false,
        openFileBrowser: jest.fn(),
        muteSounds: false,
        setMuteSounds: jest.fn(),
        setAgentsAvailable: jest.fn(),
        messageFieldFocused: false,
        setMessageFieldFocused: jest.fn(),
        setInputtingEmail: jest.fn(),
        sendTextMessage: jest.fn(),
        configuration: getMockConfiguration({
          enableChatEmailTranscript: true,
          enableChatFileAttachments: true,
          enableEmojis: true,
          playSoundOnNewMessage: true,
          flashNotificationOnNewMessage: true,
          supportedAttachmentTypes: ['image/png,image/jpeg'],
          whitelistedDomains: '',
          menuOptions: {
            customItems: [
              {
                id: 'Spidey',
                url: 'Earl',
                label: 'Babel',
                title: 'Danny McBridal',
                icon: 'info-circle',
                itemStyle: {},
                iconStyle: {},
              },
            ],
            offest: null,
          },
        }),
        chatIsSpam: false,
        setWindowScrollLockEnabled: jest.fn(),
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

  describe('No agentds available and agent availability enforced and not subscribed', () => {
    beforeEach(() => {
      testProps.agentsAvailableOrSubscribed = false;
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

    describe('current convo is spam but agent has responded to latest convo', () => {
      beforeEach(() => {
        wrapper.setProps({
          lastClosedConversationIsSpam: true,
          agentHasRespondedToLatestConversation: true,
        });
      });
      it('enables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(false);
      });
    });

    describe('current convo is spam and agent has not responded to latest convo', () => {
      beforeEach(() => {
        wrapper.setProps({
          lastClosedConversationIsSpam: true,
          agentHasRespondedToLatestConversation: false,
        });
      });
      it('disables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(true);
      });
    });

    describe('current convo is not spam but customer has no history and agent has not responded', () => {
      beforeEach(() => {
        wrapper.setProps({
          lastClosedConversationIsSpam: false,
          closedConversationCount: 0,
          agentHasRespondedToLatestConversation: false,
        });
      });
      it('disables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(true);
      });
    });

    describe('current convo is not spam, customer has no history and agent has responded to latest convo', () => {
      beforeEach(() => {
        wrapper.setProps({
          lastClosedConversationIsSpam: false,
          closedConversationCount: 0,
          agentHasRespondedToLatestConversation: true,
        });
      });
      it('enables emailTranscript', () => {
        wrapper.setProps({chatIsSpam: true});
        expect(isEmailTranscriptDisabled()).toBe(false);
      });
    });
  });

  describe('IE10', () => {
    it('uses an Input', () => {
      // $FlowIssue I'ma mutate if I wanna mutate!
      Utils.isIE10 = jest.fn(() => true);
      render();

      expect(wrapper).toMatchSnapshot();
    });
  });
});
