// @flow
import React from 'react';

import Divider from 'core-ui/components/Divider';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import styled from 'react-emotion';
import {messageTypes} from 'Common/Constants';
import {formatTime} from 'core-ui/services/i18nService';
import type {Event} from 'Common/types';

export type PlatformEventProps = {
  event: Event,
};

const {styles, fontFamily, colors} = quiqOptions;

const PlatformEventContainer = styled.div`
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

const PlatformEvent = (props: PlatformEventProps) => {
  const {timestamp} = props.event;
  const eventDescription = getMessage(messageTypes.transcriptEmailedEventMessage);
  const showTime = quiqOptions.events.showTime;
  const message = `${showTime ? formatTime(timestamp) : ''} ${eventDescription}`;

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
    </PlatformEventContainer>
  );
};

export default PlatformEvent;
