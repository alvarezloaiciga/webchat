import React from 'react';

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
      {body}
    </div>
  );
};

export default Message;
