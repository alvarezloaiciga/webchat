// @flow
import React from 'react';
import ReduxExporter from '../ReduxExporter';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('ReduxExporter component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<ReduxExporter />);
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
});
