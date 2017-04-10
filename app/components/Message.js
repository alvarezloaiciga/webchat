// @flow

import React from 'react';
import { QUIQ } from 'utils/utils';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import type { Message as MessageType } from 'types';
import './styles/Message.scss';

export type MessageProps = {
  message: MessageType,
};

const { COLOR } = QUIQ;

export const Message = (props: MessageProps) => {
  const fromCustomer = props.message.authorType === 'Guest';

  return (
    <div
      style={{ backgroundColor: fromCustomer ? COLOR : 'white' }}
      className={classnames(
        'Message',
        { fromCustomer },
      )}
    >
      <Linkify properties={{ target: '_blank', rel: 'noopener noreferrer' }}>
        { props.message.body }
      </Linkify>
    </div>
  );
};

export default Message;
