import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';

export class MessageForm extends Component {
  props;
  state = {
    text: '',
  };

  handleTextChanged = (e) => {
    this.setState({text: e.target.value});
  }

  addMessage = () => {
    const text = this.state.text.trim();
    if (text) {
      this.props.addMessage(text);
      this.setState({text: ''});
    }
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.addMessage();
    }
  }

  render() {
    return (
      <div className="messageForm">
        <Textarea
          name="message"
          value={this.state.text}
          onChange={this.handleTextChanged}
          onKeyDown={this.handleKeyDown}
          placeholder="Send us a message..."
        />
        <button className="sendBtn"
                onClick={this.addMessage}
                disabled={this.state.text.trim() === ''}
                style={{color: this.props.color}}
        >
          SEND
        </button>
      </div>
    );
  }
}

export default MessageForm;
