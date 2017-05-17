// @flow
jest.mock('utils/utils');
jest.mock('network/chat');
import QUIQ from 'utils/quiq';
import React from 'react';
import {Launcher} from '../Launcher';
import {shallow} from 'enzyme';
import {TestIntlObject} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';
import type {LauncherProps} from '../Launcher';
import {checkForAgents} from 'network/chat';

jest.useFakeTimers();

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;
  let testProps: LauncherProps;
  const mockCheckForAgents = (checkForAgents: any);

  beforeEach(() => {
    render = () => {
      testProps = {
        intl: TestIntlObject,
      };
      wrapper = shallow(<Launcher {...testProps} />);
      wrapper.instance().componentDidMount();
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

    beforeEach(() => {
      mockCheckForAgents.mockReturnValue(mockResponse);
      render();
    });

    it('renders', async () => {
      await mockResponse;
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    describe('when not hidden', () => {
      beforeEach(() => {
        wrapper.setState({chatOpen: true});
      });

      it('renders the chat container', async () => {
        await mockResponse;
        wrapper.update();
        expect(wrapper.find('ChatContainer').length).toBe(1);
      });
    });
  });

  describe('auto pop for chat', () => {
    const mockResponse = new Promise(resolve => resolve({available: true}));

    beforeEach(() => {
      QUIQ.AUTO_POP_TIME = 200;
      render();
    });

    it("opens the chat even if the end user doesn't click on it", async () => {
      await mockResponse;
      jest.runTimersToTime(200);
      wrapper.update();
      expect(wrapper.find('ChatContainer').prop('hidden')).toBe(false);
    });
  });

  describe('when agents are not available', () => {
    const mockResponse = new Promise(resolve => resolve({available: false}));

    beforeEach(() => {
      mockCheckForAgents.mockReturnValue(mockResponse);
      render();
      wrapper.setState({chatOpen: true});
    });

    it('renders', async () => {
      await mockResponse;
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
