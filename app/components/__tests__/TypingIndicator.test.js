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
      title: 'Title!',
      xScale: 1,
      yScale: 1,
      radius: {
        offset: 1,
        scale: 1,
        spacing: 1,
      },
      svgStyle: {},
      circleStyle: {},
      gradientColor: {
        foreground: '#ddd',
        background: '#333',
      },
    };
    render = () => {
      wrapper = shallow(<TypingIndicator {...testProps} />);
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
