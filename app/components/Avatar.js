// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getStyle} from 'Common/QuiqOptions';
import classnames from 'classnames';
import {getConfiguration} from 'reducers/chat';
import type {ChatConfiguration, ChatState} from 'Common/types';
import {css} from 'react-emotion';

export type AvatarProps = {
  url?: string,
  authorDisplayName?: string,
  forCustomer: boolean,
  configuration: ChatConfiguration,
};

const AvatarStyle = css`
  flex: 0 0 auto;
  height: 0;
  width: 0;

  /* So that we don't break customers who use customs styles for default images,
  we only apply our own styles if an image is defined */
  &.hasImage {
    width: 30px;
    height: 30px;
    box-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px 0;
    background-size: cover;
    border-radius: 50%;
  }
`;

export const Avatar = ({url, authorDisplayName, forCustomer = false, ...props}: AvatarProps) => {
  const customStyle = forCustomer
    ? props.configuration.styles.CustomerAvatar
    : props.configuration.styles.AgentAvatar;
  return (
    <div
      className={classnames('Avatar', AvatarStyle, {hasImage: !!url})}
      title={authorDisplayName}
      style={getStyle(customStyle, {
        marginLeft: url && forCustomer ? '5px' : 0,
        marginRight: url && !forCustomer ? '5px' : 0,
        backgroundImage: url && `url(${url})`,
      })}
    />
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Avatar);
