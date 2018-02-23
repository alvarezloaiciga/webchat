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
import type {Message as MessageType, ChatState, ChatConfiguration} from 'Common/types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
  scrollToBottom: () => void,
  configuration: ChatConfiguration,
};

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';

  const avatarUrl =
    props.message.authorProfilePicture ||
    (fromCustomer
      ? props.configuration.defaultCustomerAvatar
      : props.configuration.defaultAgentAvatar);

  const showAvatar = props.message.type !== 'AgentTyping';

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
      {!fromCustomer &&
        showAvatar && (
          <Avatar url={avatarUrl} authorDisplayName={props.message.authorDisplayName} />
        )}
      {messageComponent}
      {fromCustomer &&
        showAvatar && (
          <Avatar url={avatarUrl} authorDisplayName={props.message.authorDisplayName} forCustomer />
        )}
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Message);
