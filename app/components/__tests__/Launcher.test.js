// @flow
jest.mock('utils/utils');
jest.mock('utils/quiq');
jest.mock('../../ChatClient');
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject, getMockMessage} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {inStandaloneMode, isIEorSafari} from 'utils/utils';
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
  let hasTakenMeaningfulActionResponse;
  let isChatVisibleResponse;

  const updateAgentsAvailable = (available?: boolean = true) => {
    checkForAgentsResponse = Promise.resolve({available});
    client.checkForAgents = jest.fn(() => checkForAgentsResponse);
  };

  const updateHasTakenMeaningfulAction = (hasTakenAction?: boolean = true) => {
    hasTakenMeaningfulActionResponse = hasTakenAction;
    client.hasTakenMeaningfulAction = jest.fn(() => hasTakenMeaningfulActionResponse);
  };

  const updateIsChatVisible = (visible?: boolean = true) => {
    isChatVisibleResponse = visible;
    client.isChatVisible = jest.fn(() => isChatVisibleResponse);
  };

  beforeEach(() => {
    testProps = {
      intl: TestIntlObject,
      chatContainerHidden: false,
      chatLauncherHidden: false,
      initializedState: 'initialized',
      transcript: [],
      popped: false,

      setChatPopped: jest.fn(),
      setChatContainerHidden: jest.fn(),
      setChatLauncherHidden: jest.fn(),
      setChatInitialized: jest.fn(),
      setWelcomeFormRegistered: jest.fn(),
      setAgentTyping: jest.fn(),
      updateTranscript: jest.fn(),
    };

    init = () => {
      updateAgentsAvailable();
      updateHasTakenMeaningfulAction();
      updateIsChatVisible();
    };

    render = async () => {
      client.checkForAgents.mockReturnValue(checkForAgentsResponse);
      client.isChatVisible.mockReturnValue(isChatVisibleResponse);
      client.hasTakenMeaningfulAction.mockReturnValue(hasTakenMeaningfulActionResponse);

      wrapper = shallow(<Launcher {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();

      await checkForAgentsResponse;
      await hasTakenMeaningfulActionResponse;
      wrapper.update();
    };

    init();
  });

  describe('agentTyping', () => {
    it('stops typing after 10 seconds', async () => {
      await render();
      instance.handleAgentTyping(true);
      expect(testProps.setAgentTyping).toBeCalledWith(true);
      jest.runTimersToTime(11000);
      expect(testProps.setAgentTyping).toBeCalledWith(false);
    });
  });

  describe('toggleChat', () => {
    describe('when popped', () => {
      it('focuses standalone mode', async () => {
        testProps.popped = true;
        await render();
        await instance.toggleChat();
        expect(openStandaloneMode).toBeCalled();
      });
    });

    describe('when in IE/Safari', () => {
      it('opens standalone mode', async () => {
        (isIEorSafari: any).mockReturnValue(() => true);
        await render();
        await instance.toggleChat();
        expect(openStandaloneMode).toBeCalled();
        (isIEorSafari: any).mockReset();
      });
    });

    describe('when chat container is not visible', () => {
      it('toggles chat', async () => {
        await render();
        wrapper.setProps({chatContainerHidden: false});
        wrapper.update();
        await instance.toggleChat();
        expect(testProps.setChatContainerHidden).toBeCalledWith(true);
        wrapper.setProps({chatContainerHidden: true});
        wrapper.update();
        await instance.toggleChat();
        expect(testProps.setChatContainerHidden).toBeCalledWith(false);
      });
    });
  });

  describe('initial states', () => {
    describe('standaloneMode', () => {
      it('sets state for standalone', async () => {
        updateIsChatVisible(false);
        updateHasTakenMeaningfulAction(false);
        testProps.initializedState = 'uninitialized';
        (inStandaloneMode: any).mockReturnValue(() => true);
        await render();
        expect(wrapper).toMatchSnapshot();
        (inStandaloneMode: any).mockReset();
      });
    });

    describe('chatVisisble', () => {
      describe('when there is a transcript', () => {
        it('goes straight to the chat', async () => {
          updateIsChatVisible(true);
          updateHasTakenMeaningfulAction(false);
          testProps.initializedState = 'uninitialized';
          testProps.transcript = [getMockMessage()];
          await render();
          expect(wrapper).toMatchSnapshot();
        });
      });
    });

    describe('when user has taken meaningful action', () => {
      it('starts a session', async () => {
        updateIsChatVisible(false);
        updateHasTakenMeaningfulAction(true);
        testProps.initializedState = 'uninitialized';
        await render();
        expect(client.start).toBeCalled();
      });
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
          instance.updateCustomChatButtons = jest.fn();
        });

        it("doesn't render the default launcher", () => {
          expect(wrapper.find('Connect(ToggleChatButton)').length).toBe(0);
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
      updateIsChatVisible(false);
      testProps.chatContainerHidden = true;
      QUIQ.AUTO_POP_TIME = 200;
      await render();
    });

    it("opens the chat even if the end user doesn't click on it", () => {
      jest.runTimersToTime(200);
      wrapper.update();
      expect(testProps.setChatContainerHidden).lastCalledWith(false);
    });
  });

  describe('after a minute', () => {
    it('calls checkForAgents again', async () => {
      updateHasTakenMeaningfulAction(false);
      updateIsChatVisible(false);
      testProps.chatContainerHidden = true;
      await render();
      expect(client.checkForAgents).toBeCalled();
      jest.runTimersToTime(1000 * 60);
      expect(client.checkForAgents).toBeCalled();
    });

    describe('when chat container is not hidden', () => {
      it('assumes agents available', async () => {
        testProps.chatLauncherHidden = true;
        updateHasTakenMeaningfulAction(false);
        testProps.chatContainerHidden = true;
        await render();
        wrapper.setProps({chatContainerHidden: false});
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });

    describe('when client is popped into standalone mode', () => {
      it('assumes agents available', async () => {
        testProps.chatLauncherHidden = true;
        updateHasTakenMeaningfulAction(false);
        testProps.chatContainerHidden = true;
        await render();
        (inStandaloneMode: any).mockReturnValue(() => false);
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });
  });
});
