// @flow

jest.mock('Common/QuiqOptions');

import React from 'react';
import Spinner from '../Spinner';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Spinner component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Spinner />);
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
