// @flow
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');
jest.mock('quiq-chat');
jest.mock('services/Extensions');

import quiqOptions from 'Common/QuiqOptions';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject, getMockMessage, getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import QuiqChatClient from 'quiq-chat';
import {ChatInitializedState} from 'Common/Constants';
import {inStandaloneMode} from 'Common/Utils';
import {postExtensionEvent} from 'services/Extensions';

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
      muteSounds: false,
      transcript: [],
      setChatContainerHidden: jest.fn(),
      setChatLauncherHidden: jest.fn(),
      setChatInitialized: jest.fn(),
      setWelcomeFormRegistered: jest.fn(),
      setAgentTyping: jest.fn(),
      updateTranscript: jest.fn(),
      newWebchatSession: jest.fn(),
      setAgentsAvailable: jest.fn(),
      setAgentEndedConversation: jest.fn(),
      updatePlatformEvents: jest.fn(),
      messageFieldFocused: false,
      updateChatConfigurationFromMetadata: jest.fn(),
      markChatAsSpam: jest.fn(),
      removeMessage: jest.fn(),
      setIsAgentAssigned: jest.fn(),
      configuration: getMockConfiguration(),
      updatePersistentData: jest.fn(),
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

  describe('onNewMessages', () => {
    it('forwards on new messages to the extensionSdk', async () => {
      testProps.initializedState = 'loading';
      await render();
      instance.handleNewMessages([]);
      jest.runTimersToTime(11000);
      expect(postExtensionEvent).toBeCalledWith({
        eventType: 'transcriptChanged',
        data: {messages: []},
      });
    });
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

  describe('handleChatVisibilityChange', () => {
    describe('when chat container is visible', () => {
      it('starts session and joins chat', async () => {
        await render();
        await instance.handleChatVisibilityChange(false);
        expect(testProps.setChatLauncherHidden).toBeCalledWith(false);
        expect(QuiqChatClient.joinChat).toBeCalled();
      });
    });

    describe('when chat container is not visible', () => {
      it('leaves chat', async () => {
        await render();
        await instance.handleChatVisibilityChange(true);
        expect(QuiqChatClient.leaveChat).toBeCalled();
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
          expect(testProps.setChatLauncherHidden).toBeCalledWith(false);
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
  });

  describe('auto pop for chat', () => {
    beforeEach(async () => {
      updateIsChatVisible(false);
      updateHasTakenMeaningfulAction(false);
      testProps.chatContainerHidden = true;
      quiqOptions.autoPopTime = 200;
      await render();
    });

    describe('when agents are not available', () => {
      it('does not pop chat', () => {
        jest.runTimersToTime(200);
        wrapper.update();
        expect(testProps.setChatContainerHidden).not.toBeCalled();
      });
    });

    describe('when agents are available', () => {
      it("opens the chat even if the end user doesn't click on it", async () => {
        await render();
        jest.runTimersToTime(200);
        wrapper.update();
        expect(testProps.setAgentsAvailable).toBeCalledWith(true);
      });
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
      await instance.handleChatVisibilityChange(true);
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
        QuiqChatClient.isRegistered.mockReturnValueOnce(true);
        jest.runTimersToTime(1000 * 60);
        expect(testProps.setChatLauncherHidden).lastCalledWith(false);
      });
    });
  });
});
