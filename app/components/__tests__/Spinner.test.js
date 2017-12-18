// @flow

jest.mock('Common/QuiqOptions');
jest.mock('reducers/chat');

import React from 'react';
import {Spinner} from '../Spinner';
import {shallow} from 'enzyme';
import {getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('Spinner component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;
  const testProps = {
    configuration: getMockConfiguration(),
  };

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Spinner {...testProps} />);
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
