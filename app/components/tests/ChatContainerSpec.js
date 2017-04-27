// @flow
import React from 'react';
import ChatContainer from '../ChatContainer';
import {getMockMessage} from 'utils/testHelpers';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';
import type {ChatContainerProps} from '../ChatContainer';

describe('ChatContainer component', () => {
  let wrapper: ShallowWrapper;
  let testProps: ChatContainerProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      hidden: false,
    };

    render = () => {
      wrapper = shallow(<ChatContainer {...testProps} />);
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
          wrapper.setState({loading: false});
          expect(wrapper.find('Transcript').length).toBe(1);
          expect(wrapper.find('Spinner').length).toBe(0);
        });

        describe('when connected', () => {
          it('displays message form', () => {
            wrapper.setState({loading: false, connected: true});
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

    describe('typing indicator', () => {
      it('updates typing state', () => {
        wrapper.setState({
          loading: false,
          connected: true,
          messages: [],
          agentTyping: true,
        });

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('hidden', () => {
      it('hides the component when hidden', () => {
        testProps.hidden = true;
        render();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
