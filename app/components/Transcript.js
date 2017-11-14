import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions, {getMessage} from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import findLastIndex from 'lodash/findLastIndex';
import {getTranscript, getPlatformEvents} from 'reducers/chat';
import {messageTypes} from 'Common/Constants';
import {enableEmailForCurrentConversation} from 'Common/Utils';
import {setInputtingEmail} from 'actions/chatActions';
import type {Message as MessageType, ChatState, Event, ChatConfiguration} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
  platformEvents: Array<Event>,
  agentTyping: boolean,
  configuration: ChatConfiguration,
  setInputtingEmail: (inputtingEmail: boolean) => void,
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
    // Scroll to the bottom if you get a new message
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
      ['Attachment', 'Text', 'SendTranscript', 'End'].includes(e.type),
    );

  render() {
    const {colors} = quiqOptions;

    const messagesAndEvents = this.getConversationElementsForDisplay()
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(a => {
        if (a.type === 'Attachment' || a.type === 'Text') {
          return (
            <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
          );
        }
        return <PlatformEvent event={a} key={a.id} />;
      });

    // The last Ended event needs to have an "email transcript" action button
    if (
      this.props.configuration.enableChatEmailTranscript &&
      enableEmailForCurrentConversation(this.props.transcript, this.props.platformEvents)
    ) {
      const lastEndEventIdx = findLastIndex(
        messagesAndEvents,
        e => e.props.event && e.props.event.type === 'End',
      );
      const lastMessageIndex = findLastIndex(
        messagesAndEvents,
        e => e.props.message && ['Attachment', 'Text'].includes(e.props.message.type),
      );

      // There must be no messages after the last End event to show the inline button
      if (lastEndEventIdx > -1 && lastMessageIndex < lastEndEventIdx) {
        messagesAndEvents[lastEndEventIdx] = React.cloneElement(
          messagesAndEvents[lastEndEventIdx],
          {
            actionLabel: getMessage(messageTypes.emailTranscriptInlineButton),
            action: () => this.props.setInputtingEmail(true),
          },
        );
      }
    }

    // Append an AgentTyping message if needed
    if (this.props.agentTyping) {
      messagesAndEvents.push(
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
        }}
        ref={n => {
          this.transcript = n;
        }}
      >
        {messagesAndEvents}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setInputtingEmail,
};

export default connect(
  (state: ChatState) => ({
    transcript: getTranscript(state),
    agentTyping: state.agentTyping,
    platformEvents: getPlatformEvents(state),
    configuration: state.configuration,
  }),
  mapDispatchToProps,
)(Transcript);
