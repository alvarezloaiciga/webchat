import React, {Component} from 'react';
import Message from 'Message';
import TypingIndicator from 'TypingIndicator';
import {FormattedMessage, defineMessages} from 'react-intl';
import type {Message as MessageType} from 'types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  messages: Array<MessageType>,
  agentTyping: boolean,
};

type TranscriptState = {
  agentTyping?: number,
};

const messages = defineMessages({
  agentIsTyping: {
    id: 'agentIsTyping',
    description: 'Message to display when the agent is typing',
    defaultMessage: 'Agent is typing',
  },
});

export class Transcript extends Component {
  props: TranscriptProps;
  state: TranscriptState = {};
  transcript: any;

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
    if (this.props.agentTyping) {
      this.agentStartTyping();
    }
  }

  scrollToBottom = () => {
    if (!this.transcript) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };
  agentStartTyping = () => {
    clearInterval(this.state.agentTyping);
    this.setState({agentTyping: setTimeout(this.agentStopTyping, 10000)}, this.scrollToBottom);
  };

  agentStopTyping = () => {
    clearInterval(this.state.agentTyping);
    this.setState({agentTyping: undefined});
  };
  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.messages.length > prevProps.messages.length) {
      this.scrollToBottom();
    }
    if (!prevProps.agentTyping && this.props.agentTyping) {
      this.agentStartTyping();
    }
    if (prevProps.agentTyping && this.props.agentTyping === false) {
      this.agentStopTyping();
    }
  }

  render() {
    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
      >
        {this.props.messages.map(msg => <Message key={msg.id} message={msg} />)}
        {this.state.agentTyping &&
          <div className="poke">
            <FormattedMessage {...messages.agentIsTyping} />
            <TypingIndicator yScale={0.5} xScale={0.75} />
          </div>}
      </div>
    );
  }
}

export default Transcript;
