// @flow

jest.mock('Common/QuiqOptions');
jest.mock('reducers/chat');

import React from 'react';
import {getMockMessage, getMockConfiguration} from 'utils/testHelpers';
import type {MessageProps} from '../Message';
import {Message} from '../Message';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Message component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MessageProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      message: getMockMessage(),
      scrollToBottom: jest.fn(),
      configuration: getMockConfiguration(),
    };
    render = () => {
      wrapper = shallow(<Message {...testProps} />);
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

  describe('fromAgent', () => {
    it('colors the message according to quiqOptions', () => {
      testProps.message = getMockMessage(0, {authorType: 'User'});
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('No profile picture provided for agent', () => {
    it('renders with default picture', () => {
      testProps.message = getMockMessage(0, {authorProfilePicture: null});
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
