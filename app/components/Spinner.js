// @flow
import React from 'react';
import {messageTypes} from 'appConstants';
import QUIQ, {getMessage} from 'utils/quiq';
import {isIE9} from 'utils/utils';
import './styles/Spinner.scss';

const {COLOR} = QUIQ;

const Spinner = () =>
  <div className="Spinner">
    {!isIE9()
      ? <div className="loading" style={{borderColor: COLOR}} />
      : <span className="plainText">
          {getMessage(messageTypes.CONNECTING_MESSAGE)}
        </span>}
  </div>;

export default Spinner;
