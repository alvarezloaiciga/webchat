// @flow
import React from 'react';
import {connect} from 'react-redux';
import {getStyle} from 'Common/QuiqOptions';
import {getConfiguration, getMessage} from 'reducers/chat';
import {intlMessageTypes} from 'Common/Constants';
import TypingIndicator from 'TypingIndicator';
import type {ChatState, ChatConfiguration} from 'Common/types';

export type AgentTypingMessageProps = {
  scrollToBottom: () => void,
  configuration: ChatConfiguration,
};

export class AgentTypingMessage extends React.Component<AgentTypingMessageProps> {
  props: AgentTypingMessageProps;

  componentDidMount() {
    setTimeout(this.props.scrollToBottom, 200);
  }

  render() {
    const {colors, styles} = this.props.configuration;
    return (
      <TypingIndicator
        title={getMessage(intlMessageTypes.agentTypingMessage)}
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

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(AgentTypingMessage);
