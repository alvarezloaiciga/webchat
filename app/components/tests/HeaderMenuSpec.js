// @flow
import React from 'react';
import type {HeaderMenuProps} from '../HeaderMenu';
import HeaderMenu from '../HeaderMenu';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('HeaderMenu component', () => {
  let wrapper: ShallowWrapper;
  let testProps: HeaderMenuProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      onPop: jest.fn(),
      onMinimize: jest.fn(),
      onDock: jest.fn(),
    };
    render = () => {
      wrapper = shallow(<HeaderMenu {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with minimal props', () => {
      testProps = {};
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
