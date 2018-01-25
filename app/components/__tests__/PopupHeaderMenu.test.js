// @flow
jest.mock('quiq-chat');
jest.mock('Common/QuiqOptions');
jest.mock('services/Postmaster');
jest.mock('Common/Utils');
jest.mock('reducers/chat');

import React from 'react';
import type {PopupHeaderMenuProps} from '../PopupHeaderMenu';
import {PopupHeaderMenu} from '../PopupHeaderMenu';
import {shallow} from 'enzyme';
import {getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('HeaderMenu component', () => {
  let wrapper: ShallowWrapper;
  let testProps: PopupHeaderMenuProps;
  let render: () => void;

  global.close = jest.fn();

  beforeEach(() => {
    testProps = {
      setChatContainerHidden: jest.fn(),
      setChatPopped: jest.fn(),
      initializedState: 'initialized',
      configuration: getMockConfiguration(),
    };

    render = () => {
      wrapper = shallow(<PopupHeaderMenu {...testProps} />);
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
      wrapper.find('.icon').simulate('click');
      expect(global.close).toBeCalled();
    });
  });
});
