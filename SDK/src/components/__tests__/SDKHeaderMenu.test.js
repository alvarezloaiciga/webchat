// @flow
jest.mock('quiq-chat');
jest.mock('Common/QuiqOptions');
jest.mock('Common/Utils');

import React from 'react';
import {SDKHeaderMenu} from '../SDKHeaderMenu';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('HeaderMenu component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<SDKHeaderMenu />);
    };
  });

  describe('rendering', () => {
    it('renders', () => {
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
