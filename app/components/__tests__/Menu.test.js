// @flow
import React from 'react';
import type {MenuProps} from '../Menu';
import Menu from '../Menu';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

const mockMenuItem = (overrides?: Object = {}) => {
  const obj = {
    onClick: jest.fn(),
    label: 'label',
    title: 'title',
    id: 'id',
    disabled: false,
    icon: {
      name: 'iconName',
      style: {},
    },
    style: {},
  };

  return Object.assign({}, obj, overrides);
};

describe('Menu component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MenuProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      items: [mockMenuItem()],
      className: 'PICKLE_RIIIIIIIIIICCCCCCKKKKKK',
      containerStyle: {},
    };
    render = () => {
      wrapper = shallow(<Menu {...testProps} />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('minimal props', () => {
      it('renders', () => {
        testProps = {
          items: [],
        };

        render();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe("when title isn't available", () => {
    it('uses label', () => {
      testProps.items = [mockMenuItem({title: undefined})];
      render();
      expect(wrapper.find('[data-test="menuItem"]').prop('title')).toBe(testProps.items[0].label);
    });
  });
});
