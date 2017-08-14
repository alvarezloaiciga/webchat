// @flow
jest.mock('../../../ChatClient');
import React from 'react';
import Debugger from '../Debugger';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Debugger component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Debugger />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
