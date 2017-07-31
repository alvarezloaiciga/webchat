// @flow

import React from 'react';
import QUIQ, {getStyle} from 'utils/quiq';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import type {Message as MessageType} from 'types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
};

const {FONT_FAMILY, COLORS, STYLES} = QUIQ;

const getMessageBubbleStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(STYLES.CustomerMessageBubble, {
      backgroundColor: COLORS.customerMessageBackground,
    });
  }

  return getStyle(STYLES.AgentMessageBubble, {backgroundColor: COLORS.agentMessageBackground});
};

const getMessageTextStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(STYLES.CustomerMessageText, {
      color: COLORS.customerMessageText,
      fontFamily: FONT_FAMILY,
    });
  }

  return getStyle(STYLES.AgentMessageText, {
    color: COLORS.agentMessageText,
    fontFamily: FONT_FAMILY,
  });
};

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';

  const textStyle = getMessageTextStyle(fromCustomer);

  return (
    <div className={classnames('messageContainer', {fromCustomer})}>
      {!fromCustomer && <div className="agentAvatar" style={getStyle(STYLES.AgentAvatar)} />}
      <div
        style={getMessageBubbleStyle(fromCustomer)}
        className={classnames('Message', {fromCustomer})}
      >
        <Linkify
          properties={{
            target: '_blank',
            rel: 'noopener noreferrer',
            style: {
              fontFamily: FONT_FAMILY,
              textDecoration: 'underline',
              ...textStyle,
              color: fromCustomer ? COLORS.customerMessageLinkText : COLORS.agentMessageLinkText,
            },
          }}
        >
          <span style={textStyle}>
            {props.message.text}
          </span>
        </Linkify>
      </div>
      {fromCustomer && <div className="customerAvatar" style={getStyle(STYLES.CustomerAvatar)} />}
    </div>
  );
};

export default Message;
