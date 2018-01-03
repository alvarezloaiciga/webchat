// @flow

import React from 'react';
import {connect} from 'react-redux';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import FileMessage from './FileMessage';
import AgentTypingMessage from './AgentTypingMessage';
import classnames from 'classnames';
import {getStyle} from 'Common/QuiqOptions';
import {getConfiguration} from 'reducers/chat';
import type {Message as MessageType, ChatState, ChatConfiguration} from 'Common/types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
  scrollToBottom: () => void,
  configuration: ChatConfiguration,
};

export const Message = (props: MessageProps) => {
  const {styles} = props.configuration;

  const fromCustomer = props.message.authorType === 'Customer';

  let messageComponent;
  switch (props.message.type) {
    case 'Text':
      // $FlowIssue - Flow's type refinement isn't working here
      messageComponent = <TextMessage {...props} />;
      break;
    case 'Attachment':
      if (props.message.contentType.startsWith('image/')) {
        // $FlowIssue - Flow's type refinement isn't working here
        messageComponent = <ImageMessage scrollToBottom={props.scrollToBottom} {...props} />;
      } else {
        // $FlowIssue - Flow's type refinement isn't working here
        messageComponent = <FileMessage {...props} />;
      }
      break;
    case 'AgentTyping':
      messageComponent = <AgentTypingMessage {...props} />;
      break;
  }

  return (
    <div className={classnames('messageContainer', {fromCustomer})}>
      {!fromCustomer && <div className="agentAvatar" style={getStyle(styles.AgentAvatar)} />}
      {messageComponent}
      {fromCustomer && <div className="customerAvatar" style={getStyle(styles.CustomerAvatar)} />}
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Message);
