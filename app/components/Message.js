// @flow

import React from 'react';
import QUIQ from 'utils/quiq';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import type {Message as MessageType} from 'types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
};

const {FONT_FAMILY, COLORS} = QUIQ;

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';

  return (
    <div
      style={{
        color: fromCustomer ? COLORS.customerMessageText : COLORS.agentMessageText,
        backgroundColor: fromCustomer
          ? COLORS.customerMessageBackground
          : COLORS.agentMessageBackground,
        fontFamily: FONT_FAMILY,
      }}
      className={classnames('Message', {fromCustomer})}
    >
      <Linkify
        properties={{
          target: '_blank',
          rel: 'noopener noreferrer',
          style: {
            fontFamily: FONT_FAMILY,
            color: fromCustomer ? COLORS.customerMessageLinkText : COLORS.agentMessageLinkText,
            textDecoration: 'underline',
          },
        }}
      >
        <span style={{fontFamily: FONT_FAMILY}}>
          {props.message.text}
        </span>
      </Linkify>
    </div>
  );
};

export default Message;
