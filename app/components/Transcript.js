import React, {Component} from 'react';
import Message from 'Message/Message';
import quiqOptions from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import {getTranscript} from 'reducers/chat';
import type {Message as MessageType, ChatState} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
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
    const messages = this.props.transcript.sort((a, b) => a.timestamp - b.timestamp);

    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
        style={{backgroundColor: colors.transcriptBackground}}
      >
        {messages.map(msg => (
          <Message
            key={msg.localKey || msg.id}
            message={msg}
            scrollToBottom={this.scrollToBottom}
          />
        ))}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  transcript: getTranscript(state),
}))(Transcript);
