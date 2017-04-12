// @flow
import React from 'react';
import ChatContainer from '../ChatContainer';
import { getMockMessage } from 'utils/testHelpers';
import { shallow } from 'enzyme';
import type { ShallowWrapper } from 'enzyme';


describe('ChatContainer component', () => {
  let wrapper:ShallowWrapper;
  let render: () => void;

  beforeEach(() => {
    render = () => {
      wrapper = shallow(<ChatContainer />);
    };
  });

  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('loading', () => {
      describe('when not loading', () => {
        it('displays transcript', () => {
          wrapper.setState({ loading: false });
          expect(wrapper.find('Transcript').length).toBe(1);
          expect(wrapper.find('Spinner').length).toBe(0);
        });

        describe('when connected', () => {
          it('displays message form', () => {
            wrapper.setState({ loading: false, connected: true });
            expect(wrapper.find('Transcript').length).toBe(1);
            expect(wrapper.find('MessageForm').length).toBe(1);
            expect(wrapper.find('Spinner').length).toBe(0);
          });
        });
      });
    });

    describe('messages', () => {
      it('appends messages to the transcript', () => {
        wrapper.setState({
          loading: false,
          connected: true,
          messages: [getMockMessage(0), getMockMessage(1), getMockMessage(2)],
        });
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
