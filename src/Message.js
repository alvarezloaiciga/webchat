import React from 'react';
import Linkify from 'react-linkify';

export const Message = ({body, authorType}) => {
  let className = 'message';
  const fromCustomer = authorType === 'Guest';
  if (fromCustomer) {
    className += ' fromCustomer';
  }

  return (
    <div className={className}>
      <Linkify properties={{target: '_blank', rel: 'noopener noreferrer'}}>
        {body}
      </Linkify>
    </div>
  );
};

export default Message;
