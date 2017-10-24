// @flow
import React from 'react';
import type {EmailInputProps} from '../EmailInput';
import EmailInput from '../EmailInput';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('EmailInput component', () => {
  let wrapper: ShallowWrapper;
  let testProps: EmailInputProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
    };
    render = () => {
      wrapper = shallow(<EmailInput {...testProps} />);
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
