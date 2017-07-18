// @flow
jest.mock('../../ChatClient');
jest.mock('utils/quiq');
import React from 'react';
import type {HeaderMenuProps} from '../HeaderMenu';
import {HeaderMenu} from '../HeaderMenu';
import {getChatClient} from '../../ChatClient';
import {shallow} from 'enzyme';
import {openStandaloneMode} from 'utils/quiq';
import type {ShallowWrapper} from 'enzyme';

describe('HeaderMenu component', () => {
  let wrapper: ShallowWrapper;
  let testProps: HeaderMenuProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      setChatHidden: jest.fn(),
      setChatPopped: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<HeaderMenu {...testProps} />);
    };
  });

  describe('rendering', () => {
    it('renders', () => {
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('minimize', () => {
    it('calls minimize', () => {
      render();
      wrapper.find('.fa-window-minimize').simulate('click');
      expect(testProps.setChatHidden).toBeCalledWith(true);
      expect(getChatClient().leaveChat).toBeCalled();
    });
  });

  describe('popChat', () => {
    it('pops chat', () => {
      render();
      wrapper.find('.fa-window-maximize').simulate('click');
      expect(openStandaloneMode).toBeCalled();
    });
  });
});
