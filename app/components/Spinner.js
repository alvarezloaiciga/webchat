// @flow
import React from 'react';
import {connect} from 'react-redux';
import {getConfiguration} from 'reducers/chat';
import type {ChatState, ChatConfiguration} from 'Common/types';
import {css} from 'react-emotion';
import {spin} from 'animations';

export type SpinnerProps = {
  configuration: ChatConfiguration,
};

const SpinnerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;

  .loading {
    animation: ${spin} 1250ms infinite linear;
    border: 8px solid #59ad5d;
    border-right-color: transparent !important;
    border-radius: 32px;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    overflow: hidden;
    width: 64px;
    height: 64px;
  }
`;

export const Spinner = (props: SpinnerProps) => {
  const {color} = props.configuration;
  return (
    <div className={`Spinner ${SpinnerStyle}`}>
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
