// @flow
import React from 'react';
import ChatContainer from '../ChatContainer';
import {getMockMessage} from 'utils/testHelpers';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import messages from 'messages';
import type {ChatContainerProps} from '../ChatContainer';

jest.useFakeTimers();

describe('ChatContainer component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let testProps: ChatContainerProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      hidden: false,
      onMessage: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<ChatContainer {...testProps} />);
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

    describe('loading', () => {
      describe('when not loading', () => {
        it('displays transcript', () => {
          wrapper.setState({loading: false});
          expect(wrapper.find('Transcript').length).toBe(1);
          expect(wrapper.find('Spinner').length).toBe(0);
        });

        describe('when connected', () => {
          it('displays message form', () => {
            wrapper.setState({loading: false, connected: true});
            expect(wrapper.find('Transcript').length).toBe(1);
            expect(wrapper.find('MessageForm').length).toBe(1);
            expect(wrapper.find('Spinner').length).toBe(0);
          });
        });
      });
    });

    describe('messages', () => {
      it('appends messages to the transcript', () => {
        wrapper.setState({
          loading: false,
          connected: true,
          messages: [getMockMessage(0), getMockMessage(1), getMockMessage(2)],
        });
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('typing indicator', () => {
      describe('when agent starts typing', () => {
        const agentTypingMessage = {
          messageType: 'ChatMessage',
          data: {type: 'AgentTyping', typing: true},
        };

        beforeEach(() => {
          jest.clearAllTimers();
          wrapper.setState({loading: false, connected: true});
          instance.handleWebsocketMessage(agentTypingMessage);
          wrapper.update();
        });

        it('sets agentTyping in the MessageForm', () => {
          expect(wrapper.find('MessageForm').prop('agentTyping')).toBe(true);
        });

        describe('when another message comes in', () => {
          beforeEach(() => {
            jest.runTimersToTime(2000);
            instance.handleWebsocketMessage(agentTypingMessage);
            jest.runTimersToTime(8001); // The time the timer would have expired
            wrapper.update();
          });

          it('still shows the agent as typing', () => {
            expect(wrapper.find('MessageForm').prop('agentTyping')).toBe(true);
          });

          describe('when the second timer runs out', () => {
            beforeEach(() => {
              jest.runTimersToTime(2000);
              wrapper.update();
            });

            it('stop showing the agent as typing', () => {
              expect(wrapper.find('MessageForm').prop('agentTyping')).toBe(false);
            });
          });
        });
      });
    });

    describe('hidden', () => {
      it('hides the component when hidden', () => {
        testProps.hidden = true;
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('welcome form', () => {
      it('filters the form message', () => {
        wrapper.setState({
          loading: false,
          connected: true,
          messages: [getMockMessage(0), getMockMessage(1), getMockMessage(2)],
        });
        instance.appendMessageToChat({
          authorType: 'Customer',
          text: messages.welcomeFormUniqueIdentifier.defaultMessage,
          id: `someId`,
          timestamp: 98765432,
          type: 'Text',
        });
        expect(wrapper.state('messages').length).toBe(3);
      });
    });
  });
});
