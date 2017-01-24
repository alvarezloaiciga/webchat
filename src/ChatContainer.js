import React, {Component} from 'react';
import './App.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';

export class ChatContainer extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    setInterval(() => {
      // TODO: Need to know the URL we'd hit here
      fetch('http://localhost:3001/messages')
        .then(response => {
          response.json().then(messages => this.setState({messages}))
        })
    }, 1000);
  }

  addMessage = (text) => {
    fetch('http://localhost:3001/message', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text}),
    }).then(response => {
      response.json().then(msg => this.setState(prevState => ({messages: [...prevState.messages, msg]})))
    });
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
