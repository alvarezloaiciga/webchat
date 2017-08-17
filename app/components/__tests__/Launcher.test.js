// @flow
jest.mock('utils/utils');
jest.mock('utils/quiq');
jest.mock('quiq-chat');
import quiqOptions, {openStandaloneMode} from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject, getMockMessage} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {inStandaloneMode} from 'utils/utils';
import QuiqChatClient from 'quiq-chat';
import {ChatInitializedState} from '../../appConstants';

jest.useFakeTimers();

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let instance: any;
  let render;
  let init: () => void;
  let testProps: LauncherProps;

  let checkForAgentsResponse;
  let hasTakenMeaningfulActionResponse;
  let isChatVisibleResponse;

  const updateAgentsAvailable = (available?: boolean = true) => {
    checkForAgentsResponse = Promise.resolve({available});
    QuiqChatClient.checkForAgents = jest.fn(() => checkForAgentsResponse);
  };

  const updateHasTakenMeaningfulAction = (hasTakenAction?: boolean = true) => {
    hasTakenMeaningfulActionResponse = hasTakenAction;
    QuiqChatClient.hasTakenMeaningfulAction = jest.fn(() => hasTakenMeaningfulActionResponse);
  };

  const updateIsChatVisible = (visible?: boolean = true) => {
    isChatVisibleResponse = visible;
    QuiqChatClient.isChatVisible = jest.fn(() => isChatVisibleResponse);
  };

  beforeEach(() => {
    testProps = {
      intl: TestIntlObject,
      chatContainerHidden: false,
      chatLauncherHidden: false,
      initializedState: 'initialized',
      welcomeFormRegistered: true,
      transcript: [],
      popped: false,

      setChatPopped: jest.fn(),
      setChatContainerHidden: jest.fn(),
      setChatLauncherHidden: jest.fn(),
      setChatInitialized: jest.fn(),
      setWelcomeFormRegistered: jest.fn(),
      setAgentTyping: jest.fn(),
      updateTranscript: jest.fn(),
      newWebchatSession: jest.fn(),
    };

    init = () => {
      updateAgentsAvailable();
      updateHasTakenMeaningfulAction();
      updateIsChatVisible();
    };

    render = async () => {
      QuiqChatClient.checkForAgents.mockReturnValue(checkForAgentsResponse);
      QuiqChatClient.isChatVisible.mockReturnValue(isChatVisibleResponse);
      QuiqChatClient.hasTakenMeaningfulAction.mockReturnValue(hasTakenMeaningfulActionResponse);

      wrapper = shallow(<Launcher {...testProps} />);
      instance = wrapper.instance();
      (instance: any).componentDidMount();

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

  describe('new webchat session', () => {
    it('fires newWebchatSession action', async () => {
      await render();
      await instance.handleNewSession();
      expect(testProps.newWebchatSession.mock.calls.length).toBe(1);
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
        expect(QuiqChatClient.start).toBeCalled();
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
          quiqOptions.customLaunchButtons = ['.customButton1', '#customButton2'];
          await render();
          instance.updateCustomChatButtons = jest.fn();
        });

        it("doesn't render the default launcher", () => {
          expect(wrapper.find('Connect(ToggleChatButton)').length).toBe(0);
        });
      });

      describe('when not defined', () => {
        it('renders the default launcher', async () => {
          quiqOptions.customLaunchButtons = [];
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
      quiqOptions.autoPopTime = 200;
      await render();
    });

    it("opens the chat even if the end user doesn't click on it", () => {
      jest.runTimersToTime(200);
      wrapper.update();
      expect(testProps.setChatContainerHidden).lastCalledWith(false);
    });

    describe('when chat opens before auto_pop_time', () => {
      it('clears the timer', () => {
        instance.componentWillReceiveProps({chatContainerHidden: false});
        jest.runTimersToTime(200);
        wrapper.update();
        expect(testProps.setChatContainerHidden).not.toBeCalled();
      });

      describe('when the chat starts open', () => {
        it('clears the timer', async () => {
          updateIsChatVisible(true);
          testProps.chatContainerHidden = false;
          quiqOptions.autoPopTime = 200;
          await render();
          expect(testProps.setChatContainerHidden).not.toBeCalled();
        });
      });
    });
  });

  describe('response to client inactivity timeout', () => {
    it('sets the initialized state to inactive', async () => {
      await render();
      expect(testProps.initializedState).toBe(ChatInitializedState.INITIALIZED);
      await instance.handleClientInactiveTimeout();
      expect(testProps.setChatInitialized).toHaveBeenCalledWith(ChatInitializedState.INACTIVE);
    });

    it('restarts the client when chat is toggled', async () => {
      testProps.initializedState = ChatInitializedState.INACTIVE;
      await render();
      await instance.toggleChat();
      expect(QuiqChatClient.start).toBeCalled();
    });
  });

  describe('after a minute', () => {
    beforeEach(async () => {
      updateHasTakenMeaningfulAction(false);
      updateIsChatVisible(false);
      testProps.chatContainerHidden = true;
      testProps.chatLauncherHidden = true;
      testProps.transcript = [];
      testProps.welcomeFormRegistered = false;
      await render();
    });

    it('calls checkForAgents again', () => {
      expect(QuiqChatClient.checkForAgents).toBeCalled();
      jest.runTimersToTime(1000 * 60);
      expect(QuiqChatClient.checkForAgents).toBeCalled();
    });

    describe('when chat container is not hidden', () => {
      it('assumes agents available', () => {
        wrapper.setProps({chatContainerHidden: false});
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });

    describe('when client is popped into standalone mode', () => {
      it('assumes agents available', () => {
        (inStandaloneMode: any).mockReturnValue(() => false);
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });

    describe('when client hasTakenMeaningfulAction', () => {
      it('assumes agents available', () => {
        updateHasTakenMeaningfulAction(false);
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });

    describe('when there is a transcript', () => {
      it('assumes agents available', () => {
        wrapper.setProps({transcript: [getMockMessage()]});
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });

    describe('when welcomeForm is registered', () => {
      it('assumes agents available', () => {
        wrapper.setProps({welcomeFormRegistered: true});
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });
  });
});
