// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';
import messages from 'messages';
import QUIQ from 'utils/quiq';
import {isIE9} from 'utils/utils';
import './styles/Spinner.scss';

const {COLOR} = QUIQ;

const Spinner = () => (
  <div className="Spinner">
    {!isIE9()
      ? <div className="loading" style={{borderColor: COLOR}} />
      : <span className="plainText"><FormattedMessage {...messages.connecting} /></span>}
  </div>
);

export default Spinner;
