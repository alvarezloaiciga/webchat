// @flow

import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import ChatBubbleIcon from './ChatBubbleIcon';
import {connect} from 'react-redux';
import {isMobile} from 'Common/Utils';
import type {ChatState} from 'Common/types';
import './styles/ToggleChatButton.scss';

export type ToggleChatButtonProps = {
  toggleChat: () => void,
  chatContainerHidden: boolean,
};

const {colors, styles} = quiqOptions;

export const ToggleChatButton = ({toggleChat, chatContainerHidden}: ToggleChatButtonProps) => {
  const buttonStyle = getStyle(styles.ToggleChatButton, {backgroundColor: colors.primary});
  const iconStyle = getStyle(styles.ToggleChatButtonIcon);

  return (
    <button style={buttonStyle} onClick={toggleChat} className="ToggleChatButton">
      {!chatContainerHidden && !isMobile()
        ? <svg
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
            X
          </svg>
        : <ChatBubbleIcon style={iconStyle} />}
    </button>
  );
};

export default connect((state: ChatState) => ({
  chatContainerHidden: state.chatContainerHidden,
}))(ToggleChatButton);
