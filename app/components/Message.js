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

const {COLOR} = QUIQ;

const throwTestErrorForSentry = () => {
  throw new Error('Hello world');
};

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';

  return (
    <div
      style={{backgroundColor: fromCustomer ? COLOR : 'white'}}
      className={classnames('Message', {fromCustomer})}
      onClick={throwTestErrorForSentry}
    >
      <Linkify properties={{target: '_blank', rel: 'noopener noreferrer'}}>
        {props.message.text}
      </Linkify>
    </div>
  );
};

export default Message;
