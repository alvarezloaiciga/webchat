// @flow

jest.mock('Common/QuiqOptions');

import React from 'react';
import {getMockMessage, getMockEvent} from 'utils/testHelpers';
import type {TranscriptProps} from '../Transcript';
import {Transcript} from '../Transcript';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Transcript component', () => {
  let wrapper: ShallowWrapper;
  let testProps: TranscriptProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      transcript: [getMockMessage(1), getMockMessage(3)],
      platformEvents: [getMockEvent(2), getMockEvent(4)],
    };
    render = () => {
      wrapper = shallow(<Transcript {...testProps} />);
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
