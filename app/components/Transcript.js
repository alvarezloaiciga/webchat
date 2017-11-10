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

  isUsingCustomTrascriptScreen = () => {
    return quiqOptions.customScreens && quiqOptions.customScreens.transcriptHeaderScreen;
  };

  handleScrollToBottom = () => {
    if (!this.isUsingCustomTrascriptScreen()) {
      this.scrollToBottom();
    }
  };

  getCustomTranscriptScreenHeight = () => {
    return quiqOptions.customScreens.transcriptHeaderScreen.height
      ? quiqOptions.customScreens.transcriptHeaderScreen.height
      : '100%';
  };

  getCustomTranscriptScreenMinHeight = () => {
    return quiqOptions.customScreens.transcriptHeaderScreen.height
      ? quiqOptions.customScreens.transcriptHeaderScreen.height
      : 150;
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
        {this.isUsingCustomTrascriptScreen() && (
          <iframe
            onLoad={this.handleIFrameLoad}
            style={{
              minHeight: this.getCustomTranscriptScreenMinHeight(),
              height: this.getCustomTranscriptScreenHeight(),
              borderWidth: 0,
              flexGrow: 1,
            }}
            sandbox="allow-scripts allow-popups allow-forms"
            src={quiqOptions.customScreens.transcriptHeaderScreen.url}
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
