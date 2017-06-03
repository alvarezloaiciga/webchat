// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';
import ChatBubbleIcon from './ChatBubbleIcon';
import './styles/NoAgentsAvailable.scss';

export const NoAgentsAvailable = () =>
  <div className="NoAgentsAvailable">
    <ChatBubbleIcon />
    <FormattedMessage
      id="noAgentsAvailable"
      description="Tells the end-user that there are no webchat agents to talk to"
      defaultMessage="Sorry, no agents are currently available"
    />
  </div>;

export default NoAgentsAvailable;
