// @flow

import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import classnames from 'classnames';
import Linkify from 'react-linkify';
import type {TextMessage as TextMessageType} from 'Common/types';
import {emojify} from 'core-ui/emoji/EmojiPicker/input/Emojify';
import {css} from 'react-emotion';
import {messageEnter} from 'animations';

export type TextMessageProps = {
  message: TextMessageType,
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

const TextMessageStyle = css`
  width: auto;
  flex: 0 1 auto;
  word-wrap: break-word;
  display: inline-block;
  background: #fff;
  border: 1px solid #eaeaea;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
  text-align: left;
  animation: 0.2s 1 ${messageEnter};
  position: relative;
  overflow: hidden;
  hyphens: auto;
  box-sizing: border-box;

  a {
    color: #2199e8;
    text-decoration: none;
    cursor: pointer;
  }

  a:visited {
    color: #2199e8;
  }

  a:hover {
    outline-width: 0;
    color: #1585cf;
  }

  &.fromCustomer {
    align-self: flex-end;
    color: #fff;

    a {
      color: #0c70b2;

      &:visited {
        color: #0c70b2;
      }

      &:hover {
        color: #0c4eb2;
      }
    }
  }
`;

export const TextMessage = (props: TextMessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';
  const textStyle = getMessageTextStyle(fromCustomer);

  return (
    <div
      style={getMessageBubbleStyle(fromCustomer)}
      className={classnames('TextMessage', TextMessageStyle, {fromCustomer})}
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
        <span style={textStyle}>{emojify(props.message.text, true)}</span>
      </Linkify>
    </div>
  );
};

export default TextMessage;
