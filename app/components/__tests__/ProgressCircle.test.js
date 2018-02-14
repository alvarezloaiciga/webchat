import React from 'react';
import {ProgressCircle} from '../ProgressCircle';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('ProgressCircle component', () => {
  let wrapper: ShallowWrapper;
  const testProps = {
    percentage: 50,
    size: 60,
    progressColor: '#fff',
    trackColor: '#000',
    progressWidth: 3,
    trackWidth: 4,
  };

  describe('rendering', () => {
    it('renders', () => {
      wrapper = shallow(<ProgressCircle {...testProps} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
