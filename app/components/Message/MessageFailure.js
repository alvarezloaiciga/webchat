import React from 'react';
import {getMessage} from 'reducers/chat';
import {intlMessageTypes} from 'Common/Constants';
import styled, {css} from 'react-emotion';
import Icon from 'core-ui/components/Icon';
import {timesCircle} from 'Icons';
import {connect} from 'react-redux';
import {getStyle} from 'Common/QuiqOptions';
import type {ChatState, ChatConfiguration} from 'Common/types';

export type MessageFailureProps = {
  reason: ?string,
  configuration: ChatConfiguration,
};

const MessageFailureContainer = styled.div`
  width: 100%;
  color: red;
`;

const errorIcon = css`
  margin-right: 3px;
`;

const getReasonMessage = (reason: ?string): ?string => {
  switch (reason) {
    case 'CONTENT_TYPE_NOT_ALLOWED':
      return getMessage(intlMessageTypes.unsupportedFileType);

    default:
      return undefined;
  }
};

export const MessageFailure = (props: MessageFailureProps) => {
  const reasonMessage = getReasonMessage(props.reason);
  const {colors, styles} = props.configuration;
  return (
    <MessageFailureContainer
      style={getStyle(styles.MessageErrorText, {color: colors.error})}
      className="MessageFailure"
    >
      <Icon icon={timesCircle} className={errorIcon} />
      {getMessage(intlMessageTypes.unableToSend)}
      {reasonMessage && `: ${reasonMessage}`}
    </MessageFailureContainer>
  );
};

export default connect((state: ChatState) => ({configuration: state.configuration}), null)(
  MessageFailure,
);
