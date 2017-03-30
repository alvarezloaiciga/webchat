import React, {Component} from 'react';
import './App.css';
import MessageForm from './MessageForm';
import Transcript from './Transcript';

export class ChatContainer extends Component {
  state = {
    messages: [],
    site: undefined,
    endpoint: undefined,
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
    const endpoint = event.data && event.data.endpoint;
    if (site && endpoint) {
      this.setState({site, endpoint, chatConfigured: true});
      this.startPolling();
    }
  }

  startPolling = () => {
    this.poll = setInterval(() => {
      console.log('polling');
      const {site, endpoint} = this.state;
      fetch(`${site}/api/v1/webchat/endpoints/${endpoint}`, {
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

  addMessage = (text) => {
    const {site, endpoint} = this.state;
    fetch(`${site}/api/v1/webchat/endpoints/${endpoint}`, {
      mode: 'cors',
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({type: 'Text', body: text}),
    }).then(response => {
      response.json().then(msg => {
        const newMessage = {
          id: msg.id,
          timestamp: msg.timestamp,
          body: text,
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
