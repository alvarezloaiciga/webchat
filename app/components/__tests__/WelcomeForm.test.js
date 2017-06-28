// @flow
jest.mock('utils/quiq');
import React from 'react';
import type {WelcomeFormProps} from '../WelcomeForm';
import WelcomeForm from '../WelcomeForm';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('WelcomeForm component', () => {
  let wrapper: ShallowWrapper;
  let testProps: WelcomeFormProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      onFormSubmit: jest.fn(),
      onDock: jest.fn(),
      onMinimize: jest.fn(),
      onPop: jest.fn(),
    };

    render = () => {
      wrapper = shallow(<WelcomeForm {...testProps} />);
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
