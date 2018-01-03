// @flow

jest.mock('Common/QuiqOptions');
jest.mock('reducers/chat');

import React from 'react';
import {getMockMessage, getMockEvent, getMockConfiguration} from 'utils/testHelpers';
import type {TranscriptProps} from '../Transcript';
import {Transcript} from '../Transcript';
import {shallow} from 'enzyme';
import type {ShallowWrapper} from 'enzyme';

describe('Transcript component', () => {
  let wrapper: ShallowWrapper;
  let testProps: TranscriptProps;
  let render: () => void;

  beforeEach(() => {
    testProps = {
      allSortedConversationElements: [
        getMockMessage(1),
        getMockEvent(2),
        getMockMessage(3),
        getMockEvent(4),
      ],
      configuration: getMockConfiguration({
        enableChatEmailTranscript: true,
      }),
      agentTyping: false,
    };
    render = () => {
      wrapper = shallow(<Transcript {...testProps} />);
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

  describe('Agent Typing Message', () => {
    describe('when agent is typing', () => {
      it('shows agent typing indicator', () => {
        testProps.agentTyping = true;
        render();
        expect(
          wrapper
            .find('Connect(Message)')
            .last()
            .prop('message').type,
        ).toBe('AgentTyping');
      });
    });
  });
});
