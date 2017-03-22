import React from 'react';

export const Message = ({body, authorType}) => {
  let className = 'message';
  const fromCustomer = authorType === 'Guest';
  if (fromCustomer) {
    className += ' fromCustomer';
  }

  return (
    <div className={className}>
      {body}
    </div>
  );
};

export default Message;
