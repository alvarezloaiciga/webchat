// @flow
import React from 'react';
import {getMockMessage} from 'utils/testHelpers';
import type {TranscriptProps} from '../Transcript';
import Transcript from '../Transcript';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Transcript component', () => {
  let wrapper: ShallowWrapper;
  let testProps: TranscriptProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      messages: [getMockMessage(1), getMockMessage(2)],
      agentTyping: true,
    };
    render = () => {
      wrapper = shallow(<Transcript {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
      wrapper.setState({agentTyping: 12345672345678});
    });

    it('renders with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
