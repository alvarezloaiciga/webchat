// @flow
jest.mock('quiq-chat');
jest.mock('Common/QuiqOptions');
jest.mock('services/Postmaster');
jest.mock('Common/Utils');

import React from 'react';
import type {HeaderMenuProps} from '../HeaderMenu';
import {HeaderMenu} from '../HeaderMenu';
import {shallow} from 'enzyme';
import {standaloneOpen} from 'services/Postmaster';
import * as Utils from 'Common/Utils';
import type {ShallowWrapper} from 'enzyme';

describe('HeaderMenu component', () => {
  let wrapper: ShallowWrapper;
  let testProps: HeaderMenuProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      setChatContainerHidden: jest.fn(),
      setChatPopped: jest.fn(),
      initializedState: 'initialized',
    };

    render = () => {
      wrapper = shallow(<HeaderMenu {...testProps} />);
    };
  });

  describe('rendering', () => {
    it('renders', () => {
      render();
      expect(wrapper).toMatchSnapshot();
    });

    describe('when not in standalone mode', () => {
      beforeEach(() => {
        (Utils.inStandaloneMode: any).mockImplementation(() => false);
      });

      afterEach(() => {
        (Utils.inStandaloneMode: any).mockReset();
      });

      it('renders', () => {
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe('minimize', () => {
    it('calls minimize', () => {
      render();
      wrapper.find('.fa-window-minimize').simulate('click');
      expect(testProps.setChatContainerHidden).toBeCalledWith(true);
    });
  });

  describe('when burned', () => {
    it('hides maximize', () => {
      testProps.initializedState = 'burned';
      render();
      expect(wrapper.find('.fa-window-restore').length).toBe(0);
    });
  });

  // TODO: Re-enable me once iFrame is merged in.
  /* eslint-disable no-restricted-syntax */
  xdescribe('popChat', () => {
    it('pops chat', () => {
      render();
      wrapper.find('.fa-window-maximize').simulate('click');
      expect(standaloneOpen).toBeCalled();
    });
  });
  /* eslint-disable no-restricted-syntax */
});
