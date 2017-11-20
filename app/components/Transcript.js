import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions, {getMessage} from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import findLastIndex from 'lodash/findLastIndex';
import {
  getLatestConversationIsSpam,
  getAllConversationElements,
  getAgentHasResponded,
} from 'reducers/chat';
import {
  intlMessageTypes,
  EndEventTypes,
  MessageTypes,
  AuthorTypes,
  DisplayElementTypes,
} from 'Common/Constants';
import {setInputtingEmail} from 'actions/chatActions';
import type {Message as MessageType, ChatState, Event, ChatConfiguration} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  /*eslint-disable react/no-unused-prop-types*/
  allSortedConversationElements: Array<MessageType | Event>,
  agentHasResponded: boolean,
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
    props.allSortedConversationElements.filter(e => DisplayElementTypes.includes(e.type));

  render() {
    const {colors} = quiqOptions;

    const messagesAndEvents = this.getConversationElementsForDisplay();

    const lastEndEventIdx = findLastIndex(messagesAndEvents, e => EndEventTypes.includes(e.type));

    const lastNonSystemMessageIndex = findLastIndex(
      messagesAndEvents,
      e => Object.values(MessageTypes).includes(e.type) && e.authorType !== AuthorTypes.SYSTEM,
    );

    const displayElements = messagesAndEvents.map((a, idx) => {
      if (a.type === MessageTypes.ATTACHMENT || a.type === MessageTypes.TEXT) {
        return (
          <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
        );
      }

      // If this is last End event and there are no messages afterwards, show the inline email button
      if (
        idx === lastEndEventIdx && // Is this event the last end event?
        lastNonSystemMessageIndex < lastEndEventIdx && // Must not be any messages after end event
        this.props.agentHasResponded && // Agent must have responded at some point ion the entire transcript
        !this.props.latestConversationIsSpam
      ) {
        // Current conversation must not be spam
        return (
          <PlatformEvent
            event={a}
            key={a.id}
            action={() => this.props.setInputtingEmail(true)}
            actionLabel={getMessage(intlMessageTypes.emailTranscriptInlineButton)}
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
    agentTyping: state.agentTyping,
    allSortedConversationElements: getAllConversationElements(state),
    agentHasResponded: getAgentHasResponded(state),
    configuration: state.configuration,
  }),
  mapDispatchToProps,
)(Transcript);
