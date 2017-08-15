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

    it('renders phrase listener', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('when not hidden', () => {
      it('renders Debugger bar', () => {
        render();
        wrapper.setState({hidden: false});
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
