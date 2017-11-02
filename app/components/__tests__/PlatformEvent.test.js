// @flow
jest.mock('core-ui/services/i18nService');
jest.mock('Common/QuiqOptions');
import React from 'react';
import type {PlatformEventProps} from '../PlatformEvent';
import PlatformEvent from '../PlatformEvent';
import {shallow} from 'enzyme';
import {getMockEvent} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('PlatformEvent component', () => {
  let wrapper: ShallowWrapper;
  let testProps: PlatformEventProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      event: getMockEvent(),
    };
    render = () => {
      wrapper = shallow(<PlatformEvent {...testProps} />);
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
