// @flow
jest.mock('utils/utils');
jest.mock('../../ChatClient');
import QUIQ from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject, getMockMessage} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {getChatClient} from '../../ChatClient';

jest.useFakeTimers();

const mockClient = {
  checkForAgents: jest.fn(),
  hasActiveChat: jest.fn(),
  getLastUserEvent: jest.fn(),
};

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let render: () => void;
  let testProps: LauncherProps;
  const getMockChatClient = (getChatClient: any);

  beforeEach(() => {
    getMockChatClient.mockReturnValue(mockClient);
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
      mockClient.checkForAgents.mockReturnValue(mockResponse);
      mockClient.hasActiveChat.mockReturnValue(false);
      render();
      jest.runTimersToTime(1000 * 60);
    });

    it('calls checkForAgents again', () => {
      expect(mockClient.checkForAgents.mock.calls.length).toBe(2);
    });
  });

  describe('when agents are available', () => {
    const mockResponse = new Promise(resolve => resolve({available: true}));
    const conversationResponse = Promise.resolve({id: 'testId', messages: []});

    beforeEach(() => {
      mockClient.checkForAgents.mockReturnValue(mockResponse);
      mockClient.hasActiveChat.mockReturnValue(false);
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
      mockClient.checkForAgents.mockReturnValue(mockResponse);
    });

    describe('when there is not a conversation already in progress', () => {
      beforeEach(() => {
        mockClient.hasActiveChat.mockReturnValue(false);
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
        beforeEach(() => {
          mockClient.hasActiveChat.mockReturnValue(true);
          render();
        });

        it('renders the chat', async () => {
          await mockResponse;
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
        });

        describe('after the chat has been closed', () => {
          beforeEach(() => {
            mockClient.getLastUserEvent.mockReturnValue('Leave');
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
