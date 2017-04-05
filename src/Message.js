import React from 'react';
import Linkify from 'react-linkify';

export const Message = ({body, authorType, color}) => {
  let className = 'message';
  let msgBg = '#fff';
  const fromCustomer = authorType === 'Guest';
  if (fromCustomer) {
    className += ' fromCustomer';
    msgBg = color;
  }

  return (
    <div className={className} style={{backgroundColor: msgBg}}>
      <Linkify properties={{target: '_blank', rel: 'noopener noreferrer'}}>
        {body}
      </Linkify>
    </div>
  );
};

export default Message;
