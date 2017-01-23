import React, {Component} from 'react';
import ChatContainer from './ChatContainer';

const bottomCorner = {
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: 1000000,
};

class WebChat extends Component {
  state = {
    chatOpen: false,
  };

  toggleChat = () => {
    this.setState(prevState => ({chatOpen: !prevState.chatOpen}));
  }

  render() {
    return (
      <div style={bottomCorner}>
        {this.state.chatOpen &&
          <ChatContainer />
        }
        <button onClick={this.toggleChat} className="startChatBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z"/></svg>
        </button>
      </div>
    );
  }
}

export default WebChat;
