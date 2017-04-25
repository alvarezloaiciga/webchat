import React, { Component } from 'react';
import Message from 'Message';
import TypingIndicator from 'TypingIndicator';
import { FormattedMessage, defineMessages } from 'react-intl';
import type { Message as MessageType } from 'types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  messages: Array<MessageType>,
  agentTyping: boolean,
}

const messages = defineMessages({
  agentIsTyping: {
    id: 'agentIsTyping',
    description: 'Message to display when the agent is typing',
    defaultMessage: 'Agent is typing',
  },
});

export class Transcript extends Component {
  props: TranscriptProps;
  transcript: any;

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }


  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if ((this.props.messages.length > prevProps.messages.length) ||
      (!prevProps.agentTyping && this.props.agentTyping)) {
      this.transcript.scrollTop = this.transcript.scrollHeight;
    }
  }

  render() {
    return (
      <div className="Transcript" ref={n => { this.transcript = n; }}>
        {this.props.messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        { this.props.agentTyping && (
          <div className='poke'>
            <FormattedMessage { ...messages.agentIsTyping } />
            <TypingIndicator yScale={ 0.5 } xScale={ 0.75 } />
          </div>
        )}
      </div>
    );
  }
}

export default Transcript;
