import ReactDOM, {render} from 'react-dom';
import React from 'react';
import Routes from 'Routes';
import {quiqContainerId} from 'Common/Constants';
import {AppContainer} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import Redbox from 'redbox-react';
import {Provider} from 'react-redux';

export const appIsMounted = (): boolean => {
  const container = document.getElementById(quiqContainerId);
  if (!container) return false;
  return container.childElementCount > 0;
};

export const destructApp = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById(quiqContainerId));
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
    document.getElementById(quiqContainerId),
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
        document.getElementById(quiqContainerId),
      );
    });
  }
};

export const removeElement = (e: HTMLElement) => {
  e.parentNode.removeChild(e);
};

export const reloadApp = store => {
  destructApp();
  constructApp(store);
};

export const setFavicon = (iconUrl: string, appleTouchUrl: ?string) => {
  // Remove all icons
  const icons = [
    ...Array.from(document.querySelectorAll("link[rel='icon']")),
    ...Array.from(document.querySelectorAll("link[rel='apple-touch-icon']")),
  ];
  icons.forEach(icon => {
    removeElement(icon);
  });

  // Build icon
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = iconUrl;

  // Build apple touch icon
  const appleTouchIcon = document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.href = appleTouchUrl || iconUrl;

  // NOTE HARD: The apple-touch-icon must come BEFORE the regular icon.
  // Chrome looks for the last meta tag with a rel containing "icon" to try and use as title bar icon.
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(appleTouchIcon);
  head.appendChild(icon);
};

export const setApplicationName = (name: string) => {
  const appName = document.querySelector("meta[name='application-name']");
  if (appName) {
    removeElement(appName);
  }
  const newAppName = document.createElement('meta');
  newAppName.name = 'application-name';
  newAppName.content = name;
  document.getElementsByTagName('head')[0].appendChild(newAppName);
};

export const setBrowserThemeColor = (color: string) => {
  const colorTag = document.querySelector("meta[name='theme-color']");
  if (colorTag) {
    removeElement(colorTag);
  }
  const newColor = document.createElement('meta');
  newColor.name = 'theme-color';
  newColor.content = color;
  document.getElementsByTagName('head')[0].appendChild(newColor);
};
