import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';

export class MessageForm extends Component {
  state = {
    text: '',
  };

  handleTextChanged = (e) => {
    this.setState({text: e.target.value});
  }

  render() {
    return (
      <div className="messageForm">
        <Textarea
          name="message"
          value={this.state.text}
          onChange={this.handleTextChanged}
          placeholder="Send us a message..."
        />
      </div>
    );
  }
}

export default MessageForm;
