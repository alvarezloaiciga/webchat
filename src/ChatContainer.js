import React, {Component} from 'react';
import MessageForm from './MessageForm';
import Transcript from './Transcript';

export class ChatContainer extends Component {
  props;

  render() {
    return (
      <div className="chatContainer">
        <div className="banner">
          <span className="messageUs">
            We're here to help if you have any questions!
          </span>
        </div>
        <Transcript messages={this.props.messages}/>
        <MessageForm addMessage={this.props.addMessage}/>
      </div>
    );
  }
}

export default ChatContainer;
