import React from 'react';

export const Message = ({text, fromCustomer}) => {
  let className = 'message';
  if (fromCustomer) {
    className += ' fromCustomer';
  }

  return (
    <div className={className}>
      {text}
    </div>
  );
};

export default Message;
