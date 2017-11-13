// @flow
import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import TypingIndicator from 'TypingIndicator';

export type AgentTypingProps = {
  title?: string | IntlMessage,
};

const {colors} = quiqOptions;

const AgentTypingMessage = (props: AgentTypingProps) => {
  return <TypingIndicator />;
};

export default AgentTypingMessage;
