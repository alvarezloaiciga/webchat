// @flow
jest.mock('utils/utils');
jest.mock('quiq-chat');
jest.mock('js-cookie');
import QUIQ from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject, getMockMessage} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {checkForAgents, fetchConversation} from 'quiq-chat';
import {get} from 'js-cookie';

jest.useFakeTimers();

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let render: () => void;
  let testProps: LauncherProps;
  const mockCheckForAgents = (checkForAgents: any);
  const mockFetchConversation = (fetchConversation: any);
  const mockGetCookie = (get: any);

  beforeEach(() => {
    render = () => {
      testProps = {
        intl: TestIntlObject,
      };
      wrapper = shallow(<Launcher {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();
    };
  });

  describe('after a minute', () => {
    const mockResponse = new Promise(resolve => resolve({available: true}));

    beforeEach(() => {
      mockCheckForAgents.mockReturnValue(mockResponse);
      render();
      jest.runTimersToTime(1000 * 60);
    });

    it('calls checkForAgents again', () => {
      expect(mockCheckForAgents.mock.calls.length).toBe(2);
    });
  });

  describe('when agents are available', () => {
    const mockResponse = new Promise(resolve => resolve({available: true}));
    const conversationResponse = Promise.resolve({id: 'testId', messages: []});

    beforeEach(() => {
      mockCheckForAgents.mockReturnValue(mockResponse);
      mockFetchConversation.mockReturnValue(conversationResponse);
      render();
    });

    it('renders', async () => {
      await mockResponse;
      await conversationResponse;
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    describe('when not hidden', () => {
      beforeEach(() => {
        wrapper.setState({chatOpen: true});
      });

      it('renders the chat container', async () => {
        await mockResponse;
        await conversationResponse;
        wrapper.update();
        expect(wrapper.find('ChatContainer').length).toBe(1);
      });
    });

    describe('customLauncherButtons', () => {
      describe('when defined', () => {
        beforeEach(async () => {
          QUIQ.CUSTOM_LAUNCH_BUTTONS = ['.customButton1', '#customButton2'];
          render();
          await mockResponse;
          await conversationResponse;
          wrapper.update();
        });

        it("doesn't render the default launcher", () => {
          expect(wrapper.find('ToggleChatButton').length).toBe(0);
        });

        describe('agentsAvailable', () => {
          describe('when agents change', () => {
            it('alters the noAgentsAvailable class', () => {
              instance.updateCustomChatButtons = jest.fn();
              instance.setState({agentsAvailable: false});
              expect(instance.updateCustomChatButtons).toBeCalledWith(false);
              instance.updateCustomChatButtons = jest.fn();
              instance.setState({agentsAvailable: true});
              expect(instance.updateCustomChatButtons).toBeCalledWith(true);
            });
          });
        });
      });

      describe('when not defined', () => {
        it('renders the default launcher', async () => {
          QUIQ.CUSTOM_LAUNCH_BUTTONS = [];
          render();
          await mockResponse;
          await conversationResponse;
          wrapper.update();
          expect(wrapper.find('ToggleChatButton').length).toBe(1);
        });
      });
    });
  });

  describe('auto pop for chat', () => {
    const mockResponse = new Promise(resolve => resolve({available: true}));
    const conversationResponse = Promise.resolve({id: 'testId', messages: []});

    beforeEach(() => {
      QUIQ.AUTO_POP_TIME = 200;
      render();
    });

    it("opens the chat even if the end user doesn't click on it", async () => {
      await mockResponse;
      await conversationResponse;
      jest.runTimersToTime(200);
      wrapper.update();
      expect(wrapper.find('ChatContainer').prop('hidden')).toBe(false);
    });
  });

  describe('when agents are not available', () => {
    const mockResponse = new Promise(resolve => resolve({available: false}));
    const conversationResponse = Promise.resolve({id: 'testId', messages: []});

    beforeEach(() => {
      mockCheckForAgents.mockReturnValue(mockResponse);
    });

    describe('when there is not a conversation already in progress', () => {
      beforeEach(() => {
        mockFetchConversation.mockReturnValue(conversationResponse);
        render();
        wrapper.setState({chatOpen: true});
      });

      it('renders a placeholder', async () => {
        await mockResponse;
        await conversationResponse;
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when agents are not available', () => {
      describe('when there is a conversation already in progress', () => {
        const mockConversation = {
          id: 'testConversation',
          messages: [getMockMessage(), getMockMessage()],
        };

        beforeEach(() => {
          mockFetchConversation.mockReturnValue(Promise.resolve(mockConversation));
          mockGetCookie.mockReturnValue('true');
          render();
        });

        it('renders the chat', async () => {
          await mockResponse;
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
        });

        describe('after the chat has been closed', () => {
          beforeEach(() => {
            const closedConversation = Object.assign({}, mockConversation, {
              messages: [...mockConversation.messages, getMockMessage(3, {type: 'Leave'})],
            });
            mockFetchConversation.mockReturnValue(Promise.resolve(closedConversation));
            mockGetCookie.mockReturnValue('true');
            render();
            instance.componentDidMount();
          });

          it('leaves the chat closed', async () => {
            await mockResponse;
            wrapper.update();
            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
