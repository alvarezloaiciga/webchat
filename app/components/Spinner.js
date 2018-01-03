// @flow
import React from 'react';
import {connect} from 'react-redux';
import {getConfiguration} from 'reducers/chat';
import './styles/Spinner.scss';
import type {ChatState, ChatConfiguration} from 'Common/types';

export type SpinnerProps = {
  configuration: ChatConfiguration,
};

export const Spinner = (props: SpinnerProps) => {
  const {color} = props.configuration;
  return (
    <div className="Spinner">
      <div className="loading" style={{borderColor: color}} />
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Spinner);
