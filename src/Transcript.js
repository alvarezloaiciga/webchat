import React, {Component} from 'react';
import Message from './Message';

export class Transcript extends Component {
  props; // I miss flow
  transcript;

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (Object.keys(this.props.messages).length > Object.keys(prevProps.messages).length) {
      this.transcript.scrollTop = this.transcript.scrollHeight;
    }
  }

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  render() {
    return (
      <div className="transcript" ref={n => this.transcript = n}>
        {Object.keys(this.props.messages).map((msgId, i) => (
          <Message key={i} {...this.props.messages[msgId]}/>
        ))}
      </div>
    );
  }
}

export default Transcript;
