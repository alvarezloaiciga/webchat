// @flow

import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import {getMetadataForMimeType} from 'utils/fileUtils';
import classnames from 'classnames';
import ProgressCircle from '../ProgressCircle';
import Icon from 'core-ui/components/Icon';
import type {AttachmentMessage as AttachmentMessageType} from 'Common/types';
import './styles/FileMessage.scss';

export type FileMessageProps = {
  message: AttachmentMessageType,
};

const {fontFamily, colors, styles, width} = quiqOptions;

const getMessageBubbleStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerAttachmentBubble, {
      borderColor: colors.attachmentMessageColor,
      maxWidth: width - 82,
    });
  }

  return getStyle(styles.AgentAttachmentBubble, {
    borderColor: colors.attachmentMessageColor,
    maxWidth: width - 50,
  });
};

const getMessageTextStyle = (fromCustomer: boolean) => {
  if (fromCustomer) {
    return getStyle(styles.CustomerAttachmentText, {
      color: colors.attachmentMessageColor,
      fontFamily,
    });
  }

  return getStyle(styles.AgentAttachmentText, {
    color: colors.attachmentMessageColor,
    fontFamily,
  });
};

export const FileMessage = (props: FileMessageProps) => {
  const fromCustomer = props.message.authorType === 'Customer';
  const isUploading = props.message.status && props.message.status === 'pending';
  const textStyle = getMessageTextStyle(fromCustomer);
  const {name, icon} = getMetadataForMimeType(props.message.contentType);

  return (
    <div className="FileMessageContainer">
      <a href={props.message.url} target="_blank" rel="noopener noreferrer">
        <div
          style={getMessageBubbleStyle(fromCustomer)}
          className={classnames('FileMessage', {fromCustomer})}
        >
          <span style={textStyle}>
            <div className="IconContainer">
              {isUploading ? (
                <ProgressCircle
                  percentage={props.message.uploadProgress || 0}
                  size={30}
                  progressWidth={2}
                  trackWidth={2}
                  progressColor="#7b7b7d"
                  trackColor="rgba(242, 242, 242, 0.58)"
                />
              ) : (
                <Icon icon={icon} title={name} size="2x" />
              )}
            </div>
            {name}
          </span>
        </div>
      </a>
    </div>
  );
};

export default FileMessage;
