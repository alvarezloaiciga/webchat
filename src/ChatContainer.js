import React, {Component} from 'react';
import MessageForm from './MessageForm';
import Transcript from './Transcript';
import {getBacon} from './baconIpsum';

export class ChatContainer extends Component {
  state = {
    messages: [],
  };

  addMessage = (text) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, {text, fromCustomer: true}],
    }));

    setTimeout(() => {
      this.setState(prevState => ({
        messages: [...prevState.messages, {text: getBacon(), fromCustomer: false}],
      }));
    }, 2000);
  }

  render() {
    return (
      <div className="chatContainer">
        <div className="banner">
          <span className="messageUs">
            We're here to help if you have any questions!
          </span>
        </div>
        <Transcript messages={this.state.messages}/>
        <MessageForm addMessage={this.addMessage}/>
      </div>
    );
  }
}

export default ChatContainer;
