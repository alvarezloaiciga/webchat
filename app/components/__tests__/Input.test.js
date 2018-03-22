// @flow
import * as React from 'react';
import type {InputProps} from '../Input';
import Input from '../Input';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Input component', () => {
  let wrapper: ShallowWrapper;
  let testProps: InputProps;
  let render: () => void;
  let input: ShallowWrapper;
  let instance: any;

  const simulateInput = (value?: string) => {
    input.simulate('change', {target: {value}, persist: jest.fn()});
  };

  beforeEach(() => {
    testProps = {
      value: 'hi',
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      required: false,
      disabled: false,
      debounce: undefined,
      className: 'crazzzyyyClass',
      label: 'crazzzzyyyLabel',
      title: 'crazzzzyyyTitle',
      placeholder: 'crazzzzyyyPlaceholder',
    };
    render = () => {
      wrapper = shallow(<Input {...testProps} />);
      instance = wrapper.instance();
      instance.componentDidMount();
      input = wrapper.find('input').at(0);
    };
  });

  describe('rendering', () => {
    it('renders with all props', () => {
      render();
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with only required props', () => {
      testProps = {onChange: jest.fn()};
      render();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    beforeEach(() => {
      render();
    });

    describe('when required is false', () => {
      describe('when input is blank', () => {
        it('calls onChange', () => {
          simulateInput('');
          expect(testProps.onChange).toBeCalledWith(expect.objectContaining({target: {value: ''}}));
        });
      });

      describe('when input is not blank', () => {
        it('calls onChange', () => {
          simulateInput('newStuff');
          expect(testProps.onChange).toBeCalledWith(
            expect.objectContaining({target: {value: 'newStuff'}}),
          );
        });
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      render();
    });

    describe('when value is a string', () => {
      it('updates state', () => {
        render();

        testProps.value = 'newValue';
        instance.componentWillReceiveProps(testProps);
        expect(wrapper.state('value')).toBe('newValue');
      });
    });

    describe('when value is undefined', () => {
      it('does not update state', () => {
        render();

        const oldValue = testProps.value;
        testProps.value = undefined;
        instance.componentWillReceiveProps(testProps);
        expect(wrapper.state('value')).toBe(oldValue);
      });
    });

    describe("when value didn't change", () => {
      it('does not updates state', () => {
        render();
        instance.componentWillReceiveProps(testProps);
        expect(wrapper.state('value')).toBe(testProps.value);
      });
    });
  });
});
