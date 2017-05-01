// @flow
jest.mock('utils/utils');
jest.mock('network/chat');
import React from 'react';
import Launcher from '../Launcher';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import {checkForAgents} from 'network/chat';

describe('Launcher component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;
  const mockCheckForAgents = (checkForAgents: any);

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Launcher />);
      wrapper.instance().componentDidMount();
    };
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
