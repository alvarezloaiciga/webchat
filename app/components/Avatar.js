// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getStyle} from 'Common/QuiqOptions';
import classnames from 'classnames';
import {getConfiguration} from 'reducers/chat';
import type {ChatConfiguration, ChatState} from 'Common/types';
import './styles/Avatar.scss';

export type AvatarProps = {
  url?: string,
  authorDisplayName?: string,
  forCustomer: boolean,
  configuration: ChatConfiguration,
};

export const Avatar = ({url, authorDisplayName, forCustomer = false, ...props}: AvatarProps) => {
  const customStyle = forCustomer
    ? props.configuration.styles.CustomerAvatar
    : props.configuration.styles.AgentAvatar;
  return (
    <div
      className={classnames('Avatar', {forCustomer})}
      style={getStyle(customStyle, {
        width: url ? '30px' : 0,
        height: url ? '30px' : 0,
        marginLeft: url && forCustomer ? '5px' : 0,
        marginRight: url && !forCustomer ? '5px' : 0,
      })}
    >
      {url && <img src={url} title={authorDisplayName} />}
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Avatar);
