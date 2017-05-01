// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';
import ChatBubbleIcon from './ChatBubbleIcon';
import './styles/NoAgentsAvailable.scss';

export const NoAgentsAvailable = () => (
  <div className="NoAgentsAvailable">
    <ChatBubbleIcon />
    <FormattedMessage
      id="noAgentsAvailable"
      description="Tells the end-user that there are no webchat agents to talk to"
      defaultMessage="Sorry, there are no agents available to chat with"
    />
  </div>
);

export default NoAgentsAvailable;
