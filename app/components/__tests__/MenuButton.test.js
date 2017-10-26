// @flow
import React from 'react';
import type {MenuButtonProps} from '../MenuButton';
import MenuButton from '../MenuButton';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('MenuButton component', () => {
  let wrapper: ShallowWrapper;
  let testProps: MenuButtonProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      children: <div>Child</div>,
      buttonStyles: {},
      iconStyles: {},
      buttonText: 'buttonText',
      title: 'title',
      icon: 'icon',
      disabled: false,
      menuPosition: 'top-left',
      className: 'className',
      offset: {
        vertical: '10px',
        horizontal: '10px',
      },
      closeOnChildClick: false,
      keepChildrenMounted: false,
    };
    render = () => {
      wrapper = shallow(<MenuButton {...testProps} />);
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

  describe('children', () => {
    describe('when clicked', () => {
      it('displays children', () => {
        render();
        wrapper.find('[data-test="menuButton"]').simulate('click');
        expect(wrapper.find('[data-test="childContainer"]')).toMatchSnapshot();
      });
    });
  });

  describe('when closeOnChildClick is enabled', () => {
    it('closes on child click', () => {
      testProps.closeOnChildClick = true;
      render();
      wrapper.find('[data-test="menuButton"]').simulate('click');
      expect(wrapper.state('menuVisible')).toBe(true);
      wrapper.find('[data-test="childContainer"]').simulate('click');
      expect(wrapper.state('menuVisible')).toBe(false);
    });
  });

  describe('when keepChildrenMounted is enabled', () => {
    it('keeps children mounted', () => {
      testProps.keepChildrenMounted = true;
      render();
      expect(wrapper.state('menuVisible')).toBe(false);
      expect(wrapper.find('[data-test="childContainer"]').length).toBe(1);
    });
  });
});
