// @flow
import React from 'react';

import Divider from 'core-ui/components/Divider';
import Button from 'core-ui/components/Button';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import styled from 'react-emotion';
import {messageTypes} from 'Common/Constants';
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

  display: flex;
  flex-direction: column;
  margin: 20px 0;
  justify-content: center;
  align-items: center;
  animation: 0.2s 1 enter;

  .actionButton {
    display: block;
    flex: 0 0 auto;
    color: white;
    padding: 0 8px;
    margin-bottom: 15px;

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
  switch (event.type) {
    case 'End':
      return getMessage(messageTypes.agentEndedConversationMessage);
    case 'SendTranscript':
      return getMessage(messageTypes.transcriptEmailedEventMessage);
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
