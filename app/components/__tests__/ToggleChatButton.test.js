// @flow
jest.mock('Common/Utils');
jest.mock('Common/QuiqOptions');

import React from 'react';
import type {ToggleChatButtonProps} from '../ToggleChatButton';
import {ToggleChatButton} from '../ToggleChatButton';
import {shallow} from 'enzyme';
import {isMobile} from 'Common/Utils';
import type {ShallowWrapper} from 'enzyme';

describe('ToggleChatButton component', () => {
  let wrapper: ShallowWrapper;
  let testProps: ToggleChatButtonProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      toggleChat: jest.fn(),
      chatContainerHidden: true,
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
      testProps.chatContainerHidden = false;
      render();

      expect(wrapper).toMatchSnapshot();
    });

    describe('mobile', () => {
      beforeEach(() => {
        (isMobile: any).mockReturnValueOnce(() => true);
      });

      it('always shows blurb sbg even when hidden is true', () => {
        render();
        expect(wrapper).toMatchSnapshot();
        (isMobile: any).mockReset();
      });
    });
  });
});
