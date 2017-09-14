import {nonCompatibleBrowser} from 'Common/Utils';
import {constructApp} from 'utils/domUtils';
import quiqOptions from '../Common/QuiqOptions';
import QuiqChatClient from 'quiq-chat';
import {configureStore} from 'store/configureStore';
import {init as initMalfunctionJunction} from './services/Postmaster';
import chat, {initialState} from 'reducers/chat';

import 'main.scss';

const init = () => {
  if (nonCompatibleBrowser()) return;

  QuiqChatClient.initialize(quiqOptions.host, quiqOptions.contactPoint);
  const store = configureStore(chat, initialState);

  initMalfunctionJunction(quiqOptions.clientDomain, store);

  const root = document.createElement('div');
  root.id = 'quiqWebChat'; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  constructApp(store);

  try {
    var win = getOpener(window);
    alert(
      JSON.stringify(
        {
          isActuallySameDomain: isActuallySameDomain(win),
          isBlankDomain: isBlankDomain(win),
          getDomainWindow: getDomain(window),
          getDomainWin: getDomain(win),
        },
        2,
      ),
    );
  } catch (e) {
    alert('error' + e);
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

function getParent(win: any) {
  if (!win) {
    return;
  }

  try {
    if (win.parent && win.parent !== win) {
      return win.parent;
    }
  } catch (err) {
    return;
  }
}

function getOpener(win: any) {
  if (!win) {
    return;
  }

  // Make sure we're not actually an iframe which has had window.open() called on us
  if (getParent(win)) {
    return;
  }

  try {
    return win.opener;
  } catch (err) {
    return;
  }
}

function isActuallySameDomain(win: any) {
  try {
    let desc = Object.getOwnPropertyDescriptor(win, 'location');

    if (desc && desc.enumerable === false) {
      return false;
    }
  } catch (err) {
    // pass
  }

  try {
    if (isBlankDomain(win)) {
      return true;
    }

    if (getActualDomain(win) === getActualDomain(window)) {
      return true;
    }
  } catch (err) {
    // pass
  }

  return false;
}

function isSameDomain(win: any) {
  if (!isActuallySameDomain(win)) {
    return false;
  }

  try {
    if (isBlankDomain(win)) {
      return true;
    }

    if (getDomain(window) === getDomain(win)) {
      return true;
    }
  } catch (err) {
    // pass
  }

  return false;
}

function getDomain(win: any) {
  win = win || window;

  let domain = getActualDomain(win);

  if (domain && win.mockDomain && win.mockDomain.indexOf('mock:') === 0) {
    return win.mockDomain;
  }

  return domain;
}

function isBlankDomain(win: any) {
  try {
    if (!win.location.href) {
      return true;
    }

    if (win.location.href === 'about:blank') {
      return true;
    }
  } catch (err) {
    // pass
  }

  return false;
}

function getActualDomain(win: any) {
  let location = win.location;

  if (!location) {
    throw new Error(`Can not read window location`);
  }

  let protocol = location.protocol;

  if (!protocol) {
    throw new Error(`Can not read window protocol`);
  }

  if (protocol === 'file:') {
    return 'file://';
  }

  let host = location.host;

  if (!host) {
    throw new Error(`Can not read window host`);
  }

  return `${protocol}//${host}`;
}
