import React, {Component} from 'react';
import './App.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';

export class ChatContainer extends Component {
  state = {
    messages: [],
    site: undefined,
    contactPoint: undefined,
    chatConfigured: false,
  };

  poll;

  componentDidMount() {
    window.addEventListener('message', this.handleTenantMessage, false);
  }

  componentWillUnmount() {
    this.endPolling();
    window.removeEventListener('message', this.handleTenantMessage, false);
  }

  handleTenantMessage = (event) => {
    const origin = event.origin || event.originalEvent.origin;
    console.log(origin, event.data);

    const site = event.data && event.data.site;
    const contactPoint = event.data && event.data.contactPoint;
    if (site && contactPoint) {
      this.setState({site, contactPoint, chatConfigured: true});
      this.startPolling();
    }
  }

  startPolling = () => {
    this.poll = setInterval(() => {
      console.log('polling');
      const {site, contactPoint} = this.state;
      fetch(`${site}/api/v1/messaging/chat/${contactPoint}`, {
        mode: 'cors',
        credentials: 'include',
      }).then(response => {
          response.json().then(chat => {
            this.setState({messages: chat.messages.filter(m => m.type === 'Text')});
          })
        })
    }, 1000);
  }

  endPolling = () => {
    clearInterval(this.poll);
  }

  addMessage = (body) => {
    const {site, contactPoint} = this.state;
    fetch(`${site}/api/v1/messaging/chat/${contactPoint}/send-message`, {
      mode: 'cors',
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({body}),
    }).then(response => {
      response.json().then(msg => {
        const newMessage = {
          id: msg.id,
          timestamp: msg.timestamp,
          body,
          type: 'Text',
          authorType: 'Guest',
        };
        this.setState(prevState => ({messages: [...prevState.messages, newMessage]}))
      })
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
