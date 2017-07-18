// @flow
import React from 'react';
import type {ToggleChatButtonProps} from '../ToggleChatButton';
import {ToggleChatButton} from '../ToggleChatButton';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('ToggleChatButton component', () => {
  let wrapper: ShallowWrapper;
  let testProps: ToggleChatButtonProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      toggleChat: jest.fn(),
      hidden: true,
    };
    render = () => {
      wrapper = shallow(<ToggleChatButton {...testProps} />);
    };
  });

  describe('rendering', () => {
    it('renders', () => {
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('open', () => {
    it('switches svgs', () => {
      testProps.hidden = false;
      render();

      expect(wrapper).toMatchSnapshot();
    });
  });
});
