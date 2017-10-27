// @flow

import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import Twemoji from 'react-easy-emoji';
import {isSingleEmoji} from 'utils/emojiUtils';
import type {TextMessage as TextMessageType} from 'Common/types';
import './styles/TextMessage.scss';

export type TextMessageProps = {
  message: TextMessageType,
};

/**
 * Convert Emoji characters to <img> tags pointed at twemoji.
 * @param text {string} - String to emojify.
 * @return Array of React elements
 */
const emojify = (text: string): Array<React$Element<*>> => {
  const singleEmoji = isSingleEmoji(text);
  return Twemoji(text, {
    props: {
      style: {
        height: singleEmoji ? '30px' : '1em',
        width: singleEmoji ? '30px' : '1em',
        margin: '0px 0.05em 0px 0.1em',
        verticalAlign: '-0.2em',
      },
    },
  });
};

const {fontFamily, colors, styles, width} = quiqOptions;

const getMessageBubbleStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerMessageBubble, {
      backgroundColor: colors.customerMessageBackground,
      maxWidth: width - 82,
    });
  }

  return getStyle(styles.AgentMessageBubble, {
    backgroundColor: colors.agentMessageBackground,
    maxWidth: width - 50,
  });
};

const getMessageTextStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerMessageText, {
      color: colors.customerMessageText,
      fontFamily,
    });
  }

  return getStyle(styles.AgentMessageText, {
    color: colors.agentMessageText,
    fontFamily,
  });
};

export const TextMessage = (props: TextMessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';
  const textStyle = getMessageTextStyle(fromCustomer);

  return (
    <div
      style={getMessageBubbleStyle(fromCustomer)}
      className={classnames('TextMessage', {fromCustomer})}
    >
      <Linkify
        properties={{
          target: '_blank',
          rel: 'noopener noreferrer',
          style: {
            fontFamily,
            textDecoration: 'underline',
            ...textStyle,
            color: fromCustomer ? colors.customerMessageLinkText : colors.agentMessageLinkText,
          },
        }}
      >
        <span style={textStyle}>{emojify(props.message.text)}</span>
      </Linkify>
    </div>
  );
};

export default TextMessage;
