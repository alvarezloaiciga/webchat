// @flow
import React from 'react';
import {connect} from 'react-redux';
import Divider from 'core-ui/components/Divider';
import Button from 'core-ui/components/Button';
import {getStyle} from 'Common/QuiqOptions';
import {getConfiguration, getMessage} from 'reducers/chat';
import styled from 'react-emotion';
import {intlMessageTypes, AttachmentErrorTypes} from 'Common/Constants';
import {formatTime} from 'core-ui/services/i18nService';
import type {Event, ChatState, ChatConfiguration, AttachmentError} from 'Common/types';
import {EventTypes} from '../../Common/Constants';

export type PlatformEventProps = {
  event: Event | AttachmentError,
  actionLabel?: string,
  action?: () => void,
  configuration: ChatConfiguration,
};

const PlatformEventContainer = styled.div`
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

  display: box;
  animation: 0.2s 1 enter;

  .actionButton {
    display: block;
    color: white;
    padding: 0 8px;
    margin: 0px auto;
    margin-bottom: 10px;

    &:hover {
      color: white;
      filter: brightness(85%);
    }
  }

  & .Divider {
    z-index: 0;

    span {
      padding: 0 10px;
      font-weight: 300;
    }

    svg {
      display: block;
      stroke-width: 1px;
    }
  }
`;

const getFilename = (attachmentError: AttachmentError): string =>
  attachmentError.data && typeof attachmentError.data.filename === 'string'
    ? attachmentError.data.filename
    : '';

const getEventDescription = (event: Event | AttachmentError): ?string => {
  switch (event.type) {
    // We want to show an "End" event when convo is marked as Spam
    case EventTypes.END:
    case EventTypes.SPAM:
      return getMessage(intlMessageTypes.agentEndedConversationMessage);
    case EventTypes.SEND_TRANSCRIPT:
      return getMessage(intlMessageTypes.transcriptEmailedEventMessage);
    case EventTypes.ASSIGNED:
      // TODO: Implement this when backend sends assignment events
      return null;
    case AttachmentErrorTypes.TOO_LARGE:
      return `${getMessage(intlMessageTypes.attachmentTooLarge)} - ${getFilename(event)}`;
    case AttachmentErrorTypes.EMPTY:
      return `${getMessage(intlMessageTypes.emptyUpload)} - ${getFilename(event)}`;
    case AttachmentErrorTypes.UNSUPPORTED_TYPE:
      return `${getMessage(intlMessageTypes.unsupportedFileType)} - ${getFilename(event)}`;
    case AttachmentErrorTypes.UPLOAD_ERROR:
      return `${getMessage(intlMessageTypes.attachmentUploadError)} - ${getFilename(event)}`;
  }
};

export const PlatformEvent = (props: PlatformEventProps) => {
  const {styles, fontFamily, colors} = props.configuration;
  const {timestamp} = props.event;
  const {showTime} = props.configuration.events;
  const eventDescription = getEventDescription(props.event);
  if (!eventDescription) {
    return null;
  }

  const message = `${showTime ? formatTime(timestamp) : ''} ${eventDescription}`;

  const actionButtonStyle = getStyle(styles.InlineActionButton, {
    backgroundColor: colors.primary,
    fontFamily,
  });

  return (
    <PlatformEventContainer className="PlatformEvent" style={getStyle(styles.EventContainer)}>
      <Divider
        textStyle={getStyle(styles.EventText, {
          fontFamily,
          background: colors.transcriptBackground,
          color: colors.eventText,
        })}
        lineStyle={getStyle(styles.EventLine, {
          stroke: colors.eventText,
        })}
        text={message}
      />
      {props.actionLabel && (
        <Button
          className="actionButton"
          title={props.actionLabel}
          text={props.actionLabel}
          style={actionButtonStyle}
          onClick={props.action || (() => {})}
        />
      )}
    </PlatformEventContainer>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(PlatformEvent);
