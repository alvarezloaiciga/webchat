// @flow

import React from 'react';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import FileMessage from './FileMessage';
import AgentTypingMessage from './AgentTypingMessage';
import classnames from 'classnames';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import type {Message as MessageType} from 'Common/types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
  scrollToBottom: () => void,
};

export const Message = (props: MessageProps) => {
  const {styles} = quiqOptions;

  const fromCustomer = props.message.authorType === 'Customer';

  const margin = fromCustomer
    ? {marginLeft: 'auto', justifyContent: 'flex-end'}
    : {marginRight: 'auto', justifyContent: 'flex-start'};

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
      <div style={{display: 'flex', ...margin}}>
        {!fromCustomer && <div className="agentAvatar" style={getStyle(styles.AgentAvatar)} />}
        {messageComponent}
        {fromCustomer && <div className="customerAvatar" style={getStyle(styles.CustomerAvatar)} />}
      </div>
    </div>
  );
};

export default Message;
