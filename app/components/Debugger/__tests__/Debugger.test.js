// @flow
jest.mock('quiq-chat');
jest.mock('reducers/chat');

import React from 'react';
import {Debugger} from '../Debugger';
import {shallow} from 'enzyme';
import {getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('Debugger component', () => {
  let wrapper: ShallowWrapper;
  let render: () => void;
  const testProps = {
    configuration: getMockConfiguration(),
  };

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<Debugger {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders phrase listener', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
