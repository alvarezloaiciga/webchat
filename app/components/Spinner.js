// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'messages';
import QUIQ from 'utils/quiq';
import { getUAInfo } from 'utils/utils';
import './styles/Spinner.scss';

const { COLOR } = QUIQ;
const { major, name } = getUAInfo().browser;

const Spinner = () => (
  <div className='Spinner'>
    { name !== 'IE' || (major && parseInt(major, 10) > 9) ?
      <div className="loading" style={{ borderColor: COLOR }} /> :
      <FormattedMessage { ...messages.connecting } />
    }
  </div>
);

export default Spinner;
