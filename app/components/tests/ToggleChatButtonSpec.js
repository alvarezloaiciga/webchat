// @flow
import React from 'react';
import type { ToggleChatButtonProps } from '../ToggleChatButton';
import ToggleChatButton from '../ToggleChatButton';
import { shallow } from 'enzyme';
import type { ShallowWrapper } from 'enzyme';


describe('ToggleChatButton component', () => {
  let wrapper:ShallowWrapper;
  let testProps:ToggleChatButtonProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      toggleChat: jest.fn(),
      chatOpen: false,
    };
    render = () => {
      wrapper = shallow(<ToggleChatButton {...testProps}/>);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('open', () => {
    it('switches svgs', () => {
      testProps.chatOpen = true;
      render();

      expect(wrapper).toMatchSnapshot();
    });
  });
});
