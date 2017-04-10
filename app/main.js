import React from 'react';
import Launcher from 'Launcher';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import Redbox from 'redbox-react';

import 'main.scss';

const root = document.createElement('div');
root.id = 'quiqWebChat';
document.getElementsByTagName('body')[0].appendChild(root);

render(
  <IntlProvider locale="en">
    <AppContainer errorReporter={Redbox}>
      <Launcher />
    </AppContainer>
  </IntlProvider>,
  document.getElementById('quiqWebChat')
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
      document.getElementById('quiqWebChat')
    );
  });
}
