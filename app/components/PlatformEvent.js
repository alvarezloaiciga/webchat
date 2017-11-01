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
  const message = `${formatTime(timestamp)} ${getMessage(
    messageTypes.transcriptEmailedEventMessage,
  )}`;

  return (
    <PlatformEventContainer
      className="PlatformEvent"
      style={getStyle(styles.PlatformEventContainer)}
    >
      <Divider
        textStyle={getStyle(styles.DividerText, {
          fontFamily,
          background: colors.transcriptBackground,
          color: colors.eventText,
        })}
        lineStyle={getStyle(styles.DividerLine, {
          stroke: colors.eventText,
        })}
        text={message}
      />
    </PlatformEventContainer>
  );
};

export default PlatformEvent;
