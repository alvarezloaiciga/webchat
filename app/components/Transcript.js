import React, {Component} from 'react';
import Message from 'Message/Message';
import {onOrientationChange} from 'utils/mobileUtils';
import PlatformEvent from './PlatformEvent';
import {connect} from 'react-redux';
import findLastIndex from 'lodash/findLastIndex';
import {
  getLastClosedConversationIsSpam,
  getAllConversationElements,
  getAgentHasRespondedToLatestConversation,
  getConfiguration,
  getMessage,
} from 'reducers/chat';
import {intlMessageTypes, EndEventTypes, AuthorTypes, DisplayElementTypes} from 'Common/Constants';
import {isMessage} from 'Common/Utils';
import {setInputtingEmail} from 'actions/chatActions';
import type {Message as MessageType, ChatState, Event, ChatConfiguration} from 'Common/types';
import type {Author} from 'quiq-chat/src/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  /*eslint-disable react/no-unused-prop-types*/
  allSortedConversationElements: Array<MessageType | Event>,
  agentHasRespondedToLatestConversation: boolean,
  lastClosedConversationIsSpam: boolean,
  typingAuthor: ?Author,
  configuration: ChatConfiguration,
  setInputtingEmail: (inputtingEmail: boolean) => void,
  /*eslint-enable react/no-unused-prop-types*/
};

export class Transcript extends Component {
  props: TranscriptProps;
  scrollLock: boolean = false;
  transcript: HTMLElement;

  componentDidMount() {
    // Delay is needed for FF/IE to realize the rendered height of the transcript
    setTimeout(this.scrollToBottom, 300);

    // Listen for scroll, set scrollLock flag
    if (this.transcript) {
      this.transcript.addEventListener(
        'wheel',
        () => {
          this.scrollLock = true;
        },
        {passive: true},
      );

      this.transcript.addEventListener(
        'touchmove',
        () => {
          this.scrollLock = true;
        },
        {passive: true},
      );
    }

    onOrientationChange(this.scrollToBottom);
  }

  scrollToBottom = () => {
    if (!this.transcript || this.scrollLock) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message or new visible platform event
    const oldCount = this.getConversationElementsForDisplay(prevProps).length;
    const newCount = this.getConversationElementsForDisplay().length;
    if (newCount > oldCount) {
      this.scrollLock = false;
      this.scrollToBottom();
    }
  }

  getConversationElementsForDisplay = (
    props: TranscriptProps = this.props,
  ): Array<Message | Event> =>
    props.allSortedConversationElements.filter(e => DisplayElementTypes.includes(e.type));

  render() {
    const {colors} = this.props.configuration;

    const messagesAndEvents = this.getConversationElementsForDisplay();

    const lastEndEventIdx = findLastIndex(messagesAndEvents, e => EndEventTypes.includes(e.type));

    const lastNonSystemMessageIndex = findLastIndex(
      messagesAndEvents,
      e => isMessage(e) && e.authorType !== AuthorTypes.SYSTEM,
    );

    const displayElements = messagesAndEvents.map((a, idx) => {
      if (isMessage(a)) {
        return (
          <Message key={a.localKey || a.id} message={a} scrollToBottom={this.scrollToBottom} />
        );
      }

      // If this is last End event and there are no messages afterwards, show the inline email button
      if (
        idx === lastEndEventIdx && // Is this event the last end event?
        lastNonSystemMessageIndex < lastEndEventIdx && // Must not be any messages after end event
        (!this.props.lastClosedConversationIsSpam || // EITHER last closed conversation was not spam
          this.props.agentHasRespondedToLatestConversation) // OR agent has responded to the most recent conversation
      ) {
        return (
          <PlatformEvent
            event={a}
            key={a.id}
            action={() => this.props.setInputtingEmail(true)}
            actionLabel={getMessage(intlMessageTypes.emailTranscriptInlineButton)}
          />
        );
      }

      return <PlatformEvent event={a} key={a.id} />;
    });

    // Append an AgentTyping message if needed
    if (this.props.typingAuthor) {
      displayElements.push(
        <Message
          key="agentTyping"
          message={{type: 'AgentTyping', ...this.props.typingAuthor}}
          scrollToBottom={this.scrollToBottom}
        />,
      );
    }

    return (
      <div
        className="Transcript"
        style={{
          backgroundColor: colors.transcriptBackground,
          paddingBottom: messagesAndEvents.length > 0 ? '10px' : '0px',
        }}
        ref={n => {
          this.transcript = n;
        }}
      >
        {displayElements}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setInputtingEmail,
};

export default connect(
  (state: ChatState) => ({
    lastClosedConversationIsSpam: getLastClosedConversationIsSpam(state),
    typingAuthor: state.typingAuthor,
    allSortedConversationElements: getAllConversationElements(state),
    agentHasRespondedToLatestConversation: getAgentHasRespondedToLatestConversation(state),
    configuration: getConfiguration(state),
  }),
  mapDispatchToProps,
)(Transcript);
