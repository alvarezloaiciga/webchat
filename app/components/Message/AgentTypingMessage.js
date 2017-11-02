// @flow
import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import TypingIndicator from 'TypingIndicator';

export type AgentTypingProps = {
  title?: string | IntlMessage,
};

const {colors} = quiqOptions;

const AgentTypingMessage = (props: AgentTypingProps) => {
  return (
    <TypingIndicator
    // gradientColor={{background: '#29a049', foreground: '#35ce5e'}}
    // radius={{spacing: 0.15, offset: 0.35, scale: 1.5}}
    // xScale={4}
    // yScale={2}
    // title="Testing"
    // svgStyle={{fill: 'red'}}
    // circleStyle={{fill: 'green'}}
    />
  );
};

export default AgentTypingMessage;
