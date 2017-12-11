// @flow
import React from 'react';

import Divider from 'core-ui/components/Divider';
import Button from 'core-ui/components/Button';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import styled from 'react-emotion';
import {intlMessageTypes, AttachmentErrorTypes} from 'Common/Constants';
import {formatTime} from 'core-ui/services/i18nService';
import type {Event} from 'Common/types';

export type PlatformEventProps = {
  event: Event,
  actionLabel?: string,
  action?: () => void,
};

const {styles, fontFamily, colors} = quiqOptions;

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

const getEventDescription = (event: Event): ?string => {
  const payload = event.payload || '';

  switch (event.type) {
    // We want to show an "End" event when convo is marked as Spam
    case 'End':
    case 'Spam':
      return getMessage(intlMessageTypes.agentEndedConversationMessage);
    case 'SendTranscript':
      return getMessage(intlMessageTypes.transcriptEmailedEventMessage);
    case AttachmentErrorTypes.TOO_LARGE:
      return `${getMessage(intlMessageTypes.attachmentTooLarge)} - ${payload}`;
    case AttachmentErrorTypes.UNSUPPORTED_TYPE:
      return `${getMessage(intlMessageTypes.unsupportedFileType)} - ${payload}`;
    case AttachmentErrorTypes.UPLOAD_ERROR:
      return `${getMessage(intlMessageTypes.attachmentUploadError)} - ${payload}`;
  }
};

const PlatformEvent = (props: PlatformEventProps) => {
  const {timestamp} = props.event;
  const showTime = quiqOptions.events.showTime;
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

export default PlatformEvent;
