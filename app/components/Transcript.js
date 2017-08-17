import React, {Component} from 'react';
import Message from 'Message';
import quiqOptions from 'utils/quiq';
import {connect} from 'react-redux';
import type {Message as MessageType, ChatState} from 'types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
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
    if (this.props.transcript.length > prevProps.transcript.length) {
      this.scrollToBottom();
    }
  }

  render() {
    const {colors} = quiqOptions;

    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
        style={{backgroundColor: colors.transcriptBackground}}
      >
        {this.props.transcript.map(msg => <Message key={msg.id} message={msg} />)}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  transcript: state.transcript,
}))(Transcript);
