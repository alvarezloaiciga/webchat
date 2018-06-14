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
  display: flex;
  justify-content: flex-end;
  color: red;
  font-size: 15px;

  @keyframes enter {
    0% {
      opacity: 0;
      top: 5px;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      top: 0;
      transform: scale(1);
    }
  }

  animation: 0.2s 1 enter;

  span {
    display: block;
    flex: 1 1 auto;
  }
`;

const errorIcon = css`
  display: block;
  flex: 0 0 auto;
  margin-right: 3px;
`;

const getReasonMessage = (reason: ?string): ?string => {
  switch (reason) {
    case 'CONTENT_TYPE_NOT_ALLOWED':
      return getMessage(intlMessageTypes.unsupportedFileType);
    case 'INFECTED_UPLOAD':
      return getMessage(intlMessageTypes.infectedFile);
    case 'EMPTY_UPLOAD':
      return getMessage(intlMessageTypes.emptyUpload);
    default:
      return undefined;
  }
};

export const MessageFailure = (props: MessageFailureProps) => {
  const reasonMessage = getReasonMessage(props.reason);
  const {colors, styles, fontFamily} = props.configuration;
  return (
    <MessageFailureContainer
      style={getStyle(styles.MessageErrorText, {color: colors.error, fontFamily})}
      className="MessageFailure"
    >
      <Icon icon={timesCircle} className={errorIcon} />
      <span>{reasonMessage || getMessage(intlMessageTypes.unableToSend)}</span>
    </MessageFailureContainer>
  );
};

export default connect((state: ChatState) => ({configuration: state.configuration}), null)(
  MessageFailure,
);
