import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions, {getMessage} from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import findLastIndex from 'lodash/findLastIndex';
import {getTranscript, getPlatformEvents, getLatestConversationIsSpam} from 'reducers/chat';
import {messageTypes} from 'Common/Constants';
import {setInputtingEmail} from 'actions/chatActions';
import type {Message as MessageType, ChatState, Event, ChatConfiguration} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  /*eslint-disable react/no-unused-prop-types*/
  transcript: Array<MessageType>,
  platformEvents: Array<Event>,
  latestConversationIsSpam: boolean,
  agentTyping: boolean,
  configuration: ChatConfiguration,
  setInputtingEmail: (inputtingEmail: boolean) => void,
  /*eslint-enable react/no-unused-prop-types*/
};

export type TranscriptState = {
  inputtingEmail: boolean,
};

export class Transcript extends Component {
  props: TranscriptProps;
  state: TranscriptState = {
    inputtingEmail: false,
  };
  scrollLock: boolean = false;
  transcript: HTMLElement;

  componentDidMount() {
    this.scrollToBottom();

    // Listen for scroll, set scrollLock flag
    if (this.transcript) {
      this.transcript.addEventListener(
        'wheel',
        () => {
          this.scrollLock = true;
        },
        {passive: true},
      );
    }
  }

  scrollToBottom = () => {
    if (!this.transcript || this.scrollLock) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message or new visible platform event
    const oldCount = this.getConversationElementsForDisplay(prevProps).length;
    const newCount = this.getConversationElementsForDisplay().length;
    if (newCount > oldCount) {
      this.scrollLock = false;
      this.scrollToBottom();
    }
  }

  getConversationElementsForDisplay = (
    props: TranscriptProps = this.props,
  ): Array<Message | Event> =>
    [...props.transcript, ...props.platformEvents].filter(e =>
      ['Attachment', 'Text', 'SendTranscript', 'End', 'Spam'].includes(e.type),
    );

  render() {
    const {colors} = quiqOptions;

    const messagesAndEvents = this.getConversationElementsForDisplay().sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    const agentHasResponded = this.props.transcript.some(m => m.authorType === 'User');

    const lastEndEventIdx = findLastIndex(messagesAndEvents, e => e.type === 'End');

    const lastMessageIndex = findLastIndex(messagesAndEvents, e =>
      ['Attachment', 'Text'].includes(e.type),
    );

    const displayElements = messagesAndEvents.map((a, idx) => {
      if (a.type === 'Attachment' || a.type === 'Text') {
        return (
          <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
        );
      }

      // If this is last End event and there are no messages afterwards, show the inline email button
      if (
        idx === lastEndEventIdx && // Is this event the last end event?
        lastMessageIndex < lastEndEventIdx && // Must not be any messages after end event
        agentHasResponded && // Agent must have responded at some point ion the entire transcript
        !this.props.latestConversationIsSpam
      ) {
        // Current conversation must not be spam
        return (
          <PlatformEvent
            event={a}
            key={a.id}
            action={() => this.props.setInputtingEmail(true)}
            actionLabel={getMessage(messageTypes.emailTranscriptInlineButton)}
          />
        );
      }

      return <PlatformEvent event={a} key={a.id} />;
    });

    // Append an AgentTyping message if needed
    if (this.props.agentTyping) {
      displayElements.push(
        <Message
          key="agentTyping"
          message={{authorType: 'Agent', type: 'AgentTyping'}}
          scrollToBottom={this.scrollToBottom}
        />,
      );
    }

    return (
      <div
        className="Transcript"
        style={{
          backgroundColor: colors.transcriptBackground,
          paddingBottom: messagesAndEvents.length > 0 ? '10px' : '0px',
        }}
        ref={n => {
          this.transcript = n;
        }}
      >
        {displayElements}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setInputtingEmail,
};

export default connect(
  (state: ChatState) => ({
    latestConversationIsSpam: getLatestConversationIsSpam(state),
    transcript: getTranscript(state),
    agentTyping: state.agentTyping,
    platformEvents: getPlatformEvents(state),
    configuration: state.configuration,
  }),
  mapDispatchToProps,
)(Transcript);
