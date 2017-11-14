import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import {getTranscript, getPlatformEvents} from 'reducers/chat';
import type {Message as MessageType, ChatState, Event} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
  platformEvents: Array<Event>,
  agentTyping: boolean,
};

export class Transcript extends Component {
  props: TranscriptProps;
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
    if (this.props.transcript.length > prevProps.transcript.length) {
      this.scrollLock = false;
      this.scrollToBottom();
    }
  }

  render() {
    const {colors} = quiqOptions;

    let messagesAndEvents = [...this.props.transcript, ...this.props.platformEvents]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(a => {
        if (a.type === 'Attachment' || a.type === 'Text') {
          return (
            <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
          );
        }
        return <PlatformEvent event={a} key={a.id} />;
      });

    if (this.props.agentTyping) {
      messagesAndEvents = [
        ...messagesAndEvents,
        <Message
          key="agentTyping"
          message={{authorType: 'Agent', type: 'AgentTyping'}}
          scrollToBottom={this.scrollToBottom}
        />,
      ];
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

export default connect((state: ChatState) => ({
  transcript: getTranscript(state),
  agentTyping: state.agentTyping,
  platformEvents: getPlatformEvents(state),
}))(Transcript);
