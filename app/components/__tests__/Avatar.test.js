// @flow

import React from 'react';
import {Avatar} from '../Avatar';
import {shallow} from 'enzyme';
import {getMockConfiguration} from 'utils/testHelpers';
import type {ShallowWrapper} from 'enzyme';

describe('Avatar component', () => {
  let testProps;
  let wrapper: ShallowWrapper;

  const render = () => {
    wrapper = shallow(<Avatar {...testProps} />);
  };

  beforeEach(() => {
    testProps = {
      url: 'http://myurl.com/img.png',
      forCustomer: true,
      authorDisplayName: 'Homer S.',
      configuration: getMockConfiguration(),
    };

    render();
  });

  it('renders with image supplied', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders when no image is provided', () => {
    testProps.url = '';
    render();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when not for customer', () => {
    testProps.forCustomer = false;
    render();
    expect(wrapper).toMatchSnapshot();
  });
});
