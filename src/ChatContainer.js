import React from 'react';
import MessageForm from './MessageForm';

export const ChatContainer = () => (
  <div className="chatContainer">
    <div className="banner">
      <span className="messageUs">
        We're here to help if you have any questions!
      </span>
    </div>
    <div className="transcript"></div>
    <MessageForm />
  </div>
);

export default ChatContainer;
