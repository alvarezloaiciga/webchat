jest.mock('Common/QuiqOptions');
jest.mock('reducers/chat');

import React from 'react';
import {getMockConfiguration} from 'utils/testHelpers';
import type {MessageFailureProps} from '../MessageFailure';
import {MessageFailure} from '../MessageFailure';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('MessageFailure component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MessageFailureProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      configuration: getMockConfiguration(),
      failureReason: 'unknown',
    };
    render = () => {
      wrapper = shallow(<MessageFailure {...testProps} />);
    };
  });

  describe('rendering', () => {
    describe('when failureReason is unknown', () => {
      it('renders correctly', () => {
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when failureReason is known', () => {
      it('renders correctly', () => {
        testProps.reason = 'CONTENT_TYPE_NOT_ALLOWED';
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
