/* global __DEV__ __VERSION__ */
import 'babel-polyfill';
import {nonCompatibleBrowser} from 'utils/utils';
import React from 'react';
import Launcher from 'Launcher';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import Redbox from 'redbox-react';
import Raven from 'raven-js';

import 'main.scss';

if (!__DEV__) {
  Raven.config('https://5622397f17c44165a039d3b91d3e0193@sentry.io/170102', {
    release: __VERSION__,
  }).install();
}

const init = () => {
  if (nonCompatibleBrowser()) return;

  const root = document.createElement('div');
  root.id = 'quiqWebChat'; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  render(
    <IntlProvider locale="en">
      <AppContainer errorReporter={Redbox}>
        <Launcher />
      </AppContainer>
    </IntlProvider>,
    document.getElementById('quiqWebChat'),
  );

  if (module.hot) {
    module.hot.accept('Launcher', () => {
      const NextApp = require('Launcher').default; // eslint-disable-line global-require

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
