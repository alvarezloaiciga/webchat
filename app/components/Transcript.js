import React, { Component } from 'react';
import Message from 'Message';
import type { Message as MessageType } from 'types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  messages: Array<MessageType>,
}

export class Transcript extends Component {
  props: TranscriptProps;
  transcript: any;

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }


  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.messages.length > prevProps.messages.length) {
      this.transcript.scrollTop = this.transcript.scrollHeight;
    }
  }

  render() {
    return (
      <div className="Transcript" ref={n => { this.transcript = n; }}>
        {this.props.messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
    );
  }
}

export default Transcript;
