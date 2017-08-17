// @flow
import React from 'react';
import {messageTypes} from 'appConstants';
import quiqOptions, {getMessage} from 'utils/quiq';
import {isIE9} from 'utils/utils';
import './styles/Spinner.scss';

const {color} = quiqOptions;

const Spinner = () =>
  <div className="Spinner">
    {!isIE9()
      ? <div className="loading" style={{borderColor: color}} />
      : <span className="plainText">
          {getMessage(messageTypes.connectingMessage)}
        </span>}
  </div>;

export default Spinner;
