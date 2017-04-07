import React, {Component} from 'react';
import Message from './Message';

export class Transcript extends Component {
  props; // I miss flow
  transcript;

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.messages.length > prevProps.messages.length) {
      this.transcript.scrollTop = this.transcript.scrollHeight;
    }
  }

  componentDidMount() {
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  render() {
    return (
      <div className="transcript" ref={n => this.transcript = n}>
        {this.props.messages.map((msg) => (
          <Message key={msg.id} {...msg} color={this.props.color}/>
        ))}
      </div>
    );
  }
}

export default Transcript;
