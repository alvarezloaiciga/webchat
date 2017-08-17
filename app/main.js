import 'babel-polyfill';
import {nonCompatibleBrowser} from 'utils/utils';
import React from 'react';
import Routes from 'Routes';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import Redbox from 'redbox-react';
import quiqOptions from 'utils/quiq';
import QuiqChatClient from 'quiq-chat';
import {configureStore} from 'store/configureStore';
import {init as initMalfunctionJunction} from './services/MalfunctionJunction';
import {Provider} from 'react-redux';
import chat, {initialState} from 'reducers/chat';

import 'main.scss';

const init = () => {
  if (nonCompatibleBrowser()) return;

  QuiqChatClient.initialize(quiqOptions.host, quiqOptions.contactPoint);
  const store = configureStore(chat, initialState);

  initMalfunctionJunction(quiqOptions.clientDomain, store, QuiqChatClient);

  const root = document.createElement('div');
  root.id = 'quiqWebChat'; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <AppContainer errorReporter={Redbox}>
          <Routes />
        </AppContainer>
      </IntlProvider>
    </Provider>,
    document.getElementById('quiqWebChat'),
  );

  if (module.hot) {
    module.hot.accept('Routes', () => {
      const NextApp = require('Routes').default; // eslint-disable-line global-require

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <AppContainer errorReporter={Redbox}>
              <NextApp />
            </AppContainer>
          </IntlProvider>
        </Provider>,
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
