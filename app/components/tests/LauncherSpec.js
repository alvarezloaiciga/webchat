// @flow
import React from 'react';
import Launcher from '../Launcher';
import { shallow } from 'enzyme';
import type { ShallowWrapper } from 'enzyme';


describe('Launcher component', () => {
  let wrapper:ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Launcher />);
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

  describe('when not hidden', () => {
    beforeEach(() => {
      wrapper.setState({ chatOpen: true });
    });

    it('renders the chat container', () => {
      expect(wrapper.find('ChatContainer').length).toBe(1);
    });
  });
});
