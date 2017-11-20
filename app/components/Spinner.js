// @flow
import React from 'react';
import {intlMessageTypes} from 'Common/Constants';
import quiqOptions, {getMessage} from 'Common/QuiqOptions';
import {isIE9} from 'Common/Utils';
import './styles/Spinner.scss';

const {color} = quiqOptions;

const Spinner = () => (
  <div className="Spinner">
    {!isIE9() ? (
      <div className="loading" style={{borderColor: color}} />
    ) : (
      <span className="plainText">{getMessage(intlMessageTypes.connectingMessage)}</span>
    )}
  </div>
);

export default Spinner;
