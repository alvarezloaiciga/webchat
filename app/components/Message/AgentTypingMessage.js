// @flow
import React from 'react';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {messageTypes} from 'Common/Constants';
import TypingIndicator from 'TypingIndicator';

export type AgentTypingMessageProps = {
  scrollToBottom: () => void,
};

export class AgentTypingMessage extends React.Component<AgentTypingMessageProps> {
  props: AgentTypingMessageProps;

  componentDidMount() {
    setTimeout(this.props.scrollToBottom, 200);
  }

  render() {
    const {colors, styles} = quiqOptions;
    return (
      <TypingIndicator
        title={getMessage(messageTypes.agentTypingMessage)}
        gradientColor={{
          foreground: colors.typingIndicatorForeground,
          background: colors.typingIndicatorBackground,
        }}
        svgStyle={getStyle(styles.TypingIndicatorSvgStyle)}
        circleStyle={getStyle(styles.TypingIndicatorCircleStyle)}
      />
    );
  }
}

export default AgentTypingMessage;
