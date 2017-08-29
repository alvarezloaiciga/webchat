// @flow
jest.mock('Common/Utils');
import React from 'react';
import type {TypingIndicatorProps} from '../TypingIndicator';
import TypingIndicator from '../TypingIndicator';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('TypingIndicator component', () => {
  let wrapper: ShallowWrapper;
  let testProps: TypingIndicatorProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      color: 'blue',
      duration: 2,
      yScale: 2,
      xScale: 2,
    };
    render = () => {
      wrapper = shallow(<TypingIndicator {...testProps} />);
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
