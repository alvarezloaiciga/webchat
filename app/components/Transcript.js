import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import {getTranscript, getPlatformEvents} from 'reducers/chat';
import type {Message as MessageType, ChatState, Event} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
  platformEvents: Array<Event>,
};

export class Transcript extends Component {
  props: TranscriptProps;
  scrollLock: boolean = false;
  transcript: HTMLElement;

  componentDidMount() {
    this.handleScrollToBottom();

    // Listen for scroll, set scrollLock flag
    if (this.transcript) {
      this.transcript.addEventListener(
        'wheel',
        () => {
          this.scrollLock = true;
        },
        {passive: true},
      );
    }
  }

  scrollToBottom = () => {
    if (!this.transcript || this.scrollLock) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.transcript.length > prevProps.transcript.length) {
      this.scrollLock = false;
      this.scrollToBottom();
    }
  }

  handleIFrameLoad = () => {
    this.scrollToBottom();
  };

  isUsingWaitScreen = () => {
    return (
      quiqOptions.customScreens &&
      quiqOptions.customScreens.waitScreen &&
      this.props.transcript &&
      this.props.transcript.every(message => message.authorType !== 'User')
    );
  };

  handleScrollToBottom = () => {
    if (!this.isUsingWaitScreen()) {
      this.scrollToBottom();
    }
  };

  getWaitScreenHeight = () => {
    return quiqOptions.customScreens.waitScreen.height
      ? quiqOptions.customScreens.waitScreen.height
      : '100%';
  };

  getWaitScreenFlexGrow = () => {
    return quiqOptions.customScreens.waitScreen.height ? 0 : 1;
  };

  getWaitScreenMinHeight = () => {
    return quiqOptions.customScreens.waitScreen.minHeight
      ? quiqOptions.customScreens.waitScreen.minHeight
      : 100;
  };

  render() {
    const {colors} = quiqOptions;
    const messagesAndEvents = [...this.props.transcript, ...this.props.platformEvents].sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
        style={{backgroundColor: colors.transcriptBackground}}
      >
        {this.isUsingWaitScreen() && (
          <iframe
            onLoad={this.handleIFrameLoad}
            style={{
              minHeight: this.getWaitScreenMinHeight(),
              height: this.getWaitScreenHeight(),
              borderWidth: 0,
              flexGrow: this.getWaitScreenFlexGrow(),
            }}
            sandbox="allow-scripts allow-popups allow-forms"
            src={quiqOptions.customScreens.waitScreen.url}
          />
        )}

        {messagesAndEvents.map(a => {
          if (a.type === 'Attachment' || a.type === 'Text') {
            return (
              <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
            );
          }

          return <PlatformEvent event={a} key={a.id} />;
        })}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  transcript: getTranscript(state),
  platformEvents: getPlatformEvents(state),
}))(Transcript);
