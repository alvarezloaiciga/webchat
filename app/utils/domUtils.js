import 'babel-polyfill';
import ReactDOM, {render} from 'react-dom';
import React from 'react';
import Routes from 'Routes';
import {AppContainer} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import Redbox from 'redbox-react';
import {Provider} from 'react-redux';

export const appIsMounted = (): boolean => {
  const container = document.getElementById('quiqWebChat');
  if (!container) return false;
  return container.childElementCount > 0;
};

export const destructApp = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('quiqWebChat'));
};

export const constructApp = store => {
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
