// @flow
jest.mock('utils/utils');
jest.mock('../../ChatClient');
import QUIQ from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {getChatClient} from '../../ChatClient';

jest.useFakeTimers();

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let render;
  let init: () => void;
  let testProps: LauncherProps;
  const client = getChatClient();

  let checkForAgentsResponse;
  let hasActiveChatResponse;
  let isChatVisibleResponse;

  const updateAgentsAvailable = (available?: boolean = true) => {
    checkForAgentsResponse = Promise.resolve({available});
  };

  const updateHasActiveChat = (active?: boolean = true) => {
    hasActiveChatResponse = Promise.resolve(active);
  };

  const updateIsChatVisible = (visible?: boolean = true) => {
    isChatVisibleResponse = visible;
  };

  beforeEach(() => {
    init = () => {
      updateAgentsAvailable();
      updateHasActiveChat();
      updateIsChatVisible();
    };

    render = async () => {
      client.checkForAgents.mockReturnValue(checkForAgentsResponse);
      client.isChatVisible.mockReturnValue(isChatVisibleResponse);
      client.hasActiveChat.mockReturnValue(hasActiveChatResponse);

      testProps = {
        intl: TestIntlObject,
        setChatHidden: jest.fn(),
        setChatPopped: jest.fn(),
        hidden: false,
        popped: false,
      };
      wrapper = shallow(<Launcher {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();

      await checkForAgentsResponse;
      await hasActiveChatResponse;
      wrapper.update();
    };

    init();
  });

  describe('after a minute', () => {
    beforeEach(async () => {
      await render();
      jest.runTimersToTime(1000 * 60);
    });

    it('calls checkForAgents again', () => {
      expect(client.checkForAgents.mock.calls.length).toBe(2);
    });
  });

  describe('when agents are available', () => {
    it('renders', async () => {
      await render();
      expect(wrapper).toMatchSnapshot();
    });

    describe('customLauncherButtons', () => {
      describe('when defined', () => {
        beforeEach(async () => {
          QUIQ.CUSTOM_LAUNCH_BUTTONS = ['.customButton1', '#customButton2'];
          await render();
        });

        it("doesn't render the default launcher", () => {
          expect(wrapper.find('Connect(ToggleChatButton)').length).toBe(0);
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
          await render();
          expect(wrapper.find('Connect(ToggleChatButton)').length).toBe(1);
        });
      });
    });
  });

  describe('auto pop for chat', () => {
    beforeEach(async () => {
      QUIQ.AUTO_POP_TIME = 200;
      await render();
    });

    it("opens the chat even if the end user doesn't click on it", () => {
      jest.runTimersToTime(200);
      wrapper.update();
      expect(testProps.setChatHidden).lastCalledWith(false);
    });
  });

  describe('when agents are not available', () => {
    describe('when there is not a conversation already in progress', () => {
      it('hides the launcher', async () => {
        updateAgentsAvailable(false);
        updateHasActiveChat(false);
        await render();

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when there is an active conversation in progress', () => {
      it('renders the chat', async () => {
        updateAgentsAvailable(false);
        await render();

        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
