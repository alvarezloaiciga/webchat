// @flow

import React from 'react';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import {getMetadataForMimeType} from 'utils/fileUtils';
import classnames from 'classnames';
import CircularProgressbar from 'react-circular-progressbar';
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
                <CircularProgressbar
                  percentage={props.message.uploadProgress || 0}
                  textForPercentage={() => ''}
                />
              ) : (
                <Icon icon={icon} title={name} />
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
