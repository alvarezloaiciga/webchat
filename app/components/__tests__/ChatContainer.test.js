// @flow
jest.mock('utils/quiq');
jest.mock('../../ChatClient');
import React from 'react';
import ChatContainer from '../ChatContainer';
import {getMockMessage} from 'utils/testHelpers';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import QUIQ from 'utils/quiq';
import type {ChatContainerProps} from '../ChatContainer';
import QuiqChatClient from 'quiq-chat';
import {getChatClient} from '../../ChatClient';

const mockClient = new QuiqChatClient('testHost', 'test');

jest.useFakeTimers();

describe('ChatContainer component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let testProps: ChatContainerProps;
  let render: () => void;
  const getMockChatClient = (getChatClient: any);

  beforeEach(() => {
    mockClient.start = jest.fn();
    getMockChatClient.mockReturnValue(mockClient);
    testProps = {
      hidden: false,
      onMessage: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<ChatContainer {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();
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
          wrapper.setState({loading: false, welcomeForm: false});
          expect(wrapper.find('Transcript').length).toBe(1);
          expect(wrapper.find('Spinner').length).toBe(0);
        });

        describe('when connected', () => {
          it('displays message form', () => {
            wrapper.setState({loading: false, connected: true, welcomeForm: false});
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
        beforeEach(() => {
          jest.clearAllTimers();
          wrapper.setState({loading: false, connected: true, welcomeForm: false});
          mockClient.callbacks.onAgentTyping(true);
          wrapper.update();
        });

        it('sets agentTyping in the MessageForm', () => {
          expect(wrapper.find('MessageForm').prop('agentTyping')).toBe(true);
        });

        describe('when another message comes in', () => {
          beforeEach(() => {
            jest.runTimersToTime(2000);
            mockClient.callbacks.onAgentTyping(true);
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

    describe('when not in standalone mode and CUSTOM_LAUNCH_BUTTONS is defined', () => {
      beforeEach(() => {
        QUIQ.CUSTOM_LAUNCH_BUTTONS = ['.button1'];
        render();
      });

      it('adds the hasCustomLauncher class', () => {
        expect(wrapper.find('.ChatContainer').hasClass('hasCustomLauncher')).toBe(true);
      });
    });

    describe('hidden', () => {
      it('hides the component when hidden', () => {
        testProps.hidden = true;
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('errorOut', () => {
      it('sets component to an error state', () => {
        wrapper.setState({
          loading: true,
          error: false,
          connected: true,
        });
        instance.errorOut();
        expect(wrapper.state('loading')).toBe(false);
        expect(wrapper.state('error')).toBe(true);
        expect(wrapper.state('connected')).toBe(false);
      });
    });
  });
});
