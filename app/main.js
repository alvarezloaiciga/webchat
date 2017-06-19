import 'babel-polyfill';
import {nonCompatibleBrowser} from 'utils/utils';
import React from 'react';
import Routes from 'Routes';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import Redbox from 'redbox-react';
import QUIQ from 'utils/quiq';
import {init as initChat} from 'quiq-chat';

import 'main.scss';

const init = () => {
  if (nonCompatibleBrowser()) return;

  initChat({
    HOST: QUIQ.HOST,
    CONTACT_POINT: QUIQ.CONTACT_POINT,
  });

  const root = document.createElement('div');
  root.id = 'quiqWebChat'; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  render(
    <IntlProvider locale="en">
      <AppContainer errorReporter={Redbox}>
        <Routes />
      </AppContainer>
    </IntlProvider>,
    document.getElementById('quiqWebChat'),
  );

  if (module.hot) {
    module.hot.accept('Routes', () => {
      const NextApp = require('Routes').default; // eslint-disable-line global-require

      render(
        <IntlProvider locale="en">
          <AppContainer errorReporter={Redbox}>
            <NextApp />
          </AppContainer>
        </IntlProvider>,
        document.getElementById('quiqWebChat'),
      );
    });
  }
};

// Conditionally load Intl polyfill for old versions of IE
// TODO: Load correct locale once we add i18n
if (!global.Intl) {
  require.ensure(['intl', 'intl/locale-data/jsonp/en.js'], function(require) {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    init();
  });
} else {
  init();
}
