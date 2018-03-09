// @flow
jest.mock('core-ui/services/i18nService');
jest.mock('Common/QuiqOptions');
jest.mock('reducers/chat');

import React from 'react';
import type {PlatformEventProps} from '../PlatformEvent';
import {PlatformEvent} from '../PlatformEvent';
import {shallow} from 'enzyme';
import {AttachmentErrorTypes} from 'Common/Constants';
import {getMockEvent, getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('PlatformEvent component', () => {
  let wrapper: ShallowWrapper;
  let testProps: PlatformEventProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      event: getMockEvent(),
      configuration: getMockConfiguration(),
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

  describe('attachmentErrors', () => {
    it('displays them', () => {
      testProps.event = {
        type: AttachmentErrorTypes.TOO_LARGE,
        id: '1',
        timestamp: 1,
        data: {filename: 'Xmas'},
      };
      render();
      expect(wrapper).toMatchSnapshot();

      testProps.event.type = AttachmentErrorTypes.UNSUPPORTED_TYPE;
      render();
      expect(wrapper).toMatchSnapshot();

      testProps.event.type = AttachmentErrorTypes.UPLOAD_ERROR;
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
