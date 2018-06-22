// @flow

import React from 'react';
import {connect} from 'react-redux';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import FileMessage from './FileMessage';
import AgentTypingMessage from './AgentTypingMessage';
import classnames from 'classnames';
import {getConfiguration} from 'reducers/chat';
import Avatar from '../Avatar';
import MessageFailure from './MessageFailure';
import type {Message as MessageType, ChatState, ChatConfiguration} from 'Common/types';
import {MessageStatus} from 'Common/Constants';
import {css} from 'react-emotion';

export type MessageProps = {
  message: MessageType,
  scrollToBottom: () => void,
  configuration: ChatConfiguration,
};

const MessageStyle = css`
  margin: 8px 50px 8px 16px;
  display: inline-block;
  flex: 0 0 auto;
  overflow-x: hidden;
  overflow-y: hidden;

  .MessageContent {
    display: flex;
    justify-content: flex-start;
    align-self: stretch;
    overflow-x: hidden;
    overflow-y: hidden;
    align-items: center;
    transition: opacity 0.3s ease-in;

    &.failed {
      opacity: 0.4;
    }
  }

  .MessageFailure {
    margin-top: 5px;
    float: left;
  }

  &.fromCustomer {
    margin-right: 16px;
    margin-left: 50px;
    align-self: stretch;

    .MessageContent {
      justify-content: flex-end;
    }

    .MessageFailure {
      float: right;
    }
  }
`;

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';
  const failed = props.message.status === MessageStatus.FAILED;

  const avatarUrl =
    props.message.authorProfilePicture ||
    (fromCustomer
      ? props.configuration.defaultCustomerAvatar
      : props.configuration.defaultAgentAvatar);

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
    <div className={classnames('messageContainer', MessageStyle, {fromCustomer})}>
      <div className={classnames('MessageContent', {failed})}>
        {!fromCustomer && (
          <Avatar url={avatarUrl} authorDisplayName={props.message.authorDisplayName} />
        )}
        {messageComponent}
        {fromCustomer && (
          <Avatar url={avatarUrl} authorDisplayName={props.message.authorDisplayName} forCustomer />
        )}
      </div>
      {failed && <MessageFailure reason={props.message.failureReason} />}
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Message);
