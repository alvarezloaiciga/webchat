// @flow

import React from 'react';
import quiqObject, {getStyle} from 'utils/quiq';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import type {Message as MessageType} from 'types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
};

const {fontFamily, colors, styles, width} = quiqObject;

const getMessageBubbleStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerMessageBubble, {
      backgroundColor: colors.customerMessageBackground,
      maxWidth: width - 82,
    });
  }

  return getStyle(styles.AgentMessageBubble, {
    backgroundColor: colors.agentMessageBackground,
    maxWidth: width - 50,
  });
};

const getMessageTextStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerMessageText, {
      color: colors.customerMessageText,
      fontFamily: fontFamily,
    });
  }

  return getStyle(styles.AgentMessageText, {
    color: colors.agentMessageText,
    fontFamily: fontFamily,
  });
};

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';

  const textStyle = getMessageTextStyle(fromCustomer);

  const margin = fromCustomer
    ? {marginLeft: 'auto', justifyContent: 'flex-end'}
    : {marginRight: 'auto', justifyContent: 'flex-start'};

  return (
    <div className={classnames('messageContainer', {fromCustomer})}>
      <div style={{display: 'flex', ...margin}}>
        {!fromCustomer && <div className="agentAvatar" style={getStyle(styles.AgentAvatar)} />}
        <div
          style={getMessageBubbleStyle(fromCustomer)}
          className={classnames('Message', {fromCustomer})}
        >
          <Linkify
            properties={{
              target: '_blank',
              rel: 'noopener noreferrer',
              style: {
                fontFamily: fontFamily,
                textDecoration: 'underline',
                ...textStyle,
                color: fromCustomer ? colors.customerMessageLinkText : colors.agentMessageLinkText,
              },
            }}
          >
            <span style={textStyle}>
              {props.message.text}
            </span>
          </Linkify>
        </div>
        {fromCustomer && <div className="customerAvatar" style={getStyle(styles.CustomerAvatar)} />}
      </div>
    </div>
  );
};

export default Message;
