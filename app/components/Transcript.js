import React, {Component} from 'react';
import Message from 'Message';
import QUIQ from 'utils/quiq';
import type {Message as MessageType} from 'types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  messages: Array<MessageType>,
};

export class Transcript extends Component {
  props: TranscriptProps;
  transcript: any;

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  scrollToBottom = () => {
    if (!this.transcript) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.messages.length > prevProps.messages.length) {
      this.scrollToBottom();
    }
  }

  render() {
    const {COLORS} = QUIQ;

    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
        style={{backgroundColor: COLORS.transcriptBackground}}
      >
        {this.props.messages.map(msg => <Message key={msg.id} message={msg} />)}
      </div>
    );
  }
}

export default Transcript;
