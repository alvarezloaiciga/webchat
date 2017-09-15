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
  testStuff();
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

function isRegex(item: any) {
  return Object.prototype.toString.call(item) === '[object RegExp]';
}

const CONSTANTS = {
  MOCK_PROTOCOL: 'mock:',
  FILE_PROTOCOL: 'file:',
  WILDCARD: '*',
};

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

  if (protocol === 'file:') {
    return 'file://';
  }

  let host = location.host;

  if (!host) {
    throw new Error(`Can not read window host`);
  }

  return true;
}

function getUserAgent(win: any) {
  win = win || window;
  return win.navigator.mockUserAgent || win.navigator.userAgent;
}

function needsBridgeForBrowser(): boolean {
  if (getUserAgent(window).match(/MSIE|trident|edge/i)) {
    return true;
  }

  return false;
}

function needsBridgeForWin(win: any): boolean {
  if (!isSameTopWindow(window, win)) {
    return true;
  }

  return false;
}

function isAncestorParent(parent: any, child: any) {
  if (!parent || !child) {
    return false;
  }

  let childParent = getParent(child);

  if (childParent) {
    return childParent === parent;
  }

  if (getParents(child).indexOf(parent) !== -1) {
    return true;
  }

  return false;
}

function getParents(win: any) {
  let result = [];

  try {
    while (win.parent !== win) {
      result.push(win.parent);
      win = win.parent;
    }
  } catch (err) {
    // pass
  }

  return result;
}

function getTop(win: any) {
  if (!win) {
    return;
  }

  try {
    if (win.top) {
      return win.top;
    }
  } catch (err) {
    // pass
  }

  if (getParent(win) === win) {
    return win;
  }

  try {
    if (isAncestorParent(window, win) && window.top) {
      return window.top;
    }
  } catch (err) {
    // pass
  }

  try {
    if (isAncestorParent(win, window) && window.top) {
      return window.top;
    }
  } catch (err) {
    // pass
  }

  for (let frame of getAllChildFrames(win)) {
    try {
      if (frame.top) {
        return frame.top;
      }
    } catch (err) {
      // pass
    }

    if (getParent(frame) === frame) {
      return frame;
    }
  }
}

function getAllChildFrames(win: any) {
  let result = [];

  for (let frame of getFrames(win)) {
    result.push(frame);

    for (let childFrame of getAllChildFrames(frame)) {
      result.push(childFrame);
    }
  }

  return result;
}

function getFrames(win: any) {
  let result = [];

  let frames;

  try {
    frames = win.frames;
  } catch (err) {
    frames = win;
  }

  let len;

  try {
    len = frames.length;
  } catch (err) {
    // pass
  }

  if (len === 0) {
    return result;
  }

  if (len) {
    for (let i = 0; i < len; i++) {
      let frame;

      try {
        frame = frames[i];
      } catch (err) {
        continue;
      }

      result.push(frame);
    }

    return result;
  }

  for (let i = 0; i < 100; i++) {
    let frame;

    try {
      frame = frames[i];
    } catch (err) {
      return result;
    }

    if (!frame) {
      return result;
    }

    result.push(frame);
  }

  return result;
}

function getAllFramesInWindow(win: any) {
  let top = getTop(win);
  return getAllChildFrames(top).concat(top);
}

function isSameTopWindow(win1: any, win2: any) {
  let top1 = getTop(win1);
  let top2 = getTop(win2);

  try {
    if (top1 && top2) {
      if (top1 === top2) {
        return true;
      }

      return false;
    }
  } catch (err) {
    // pass
  }

  let allFrames1 = getAllFramesInWindow(win1);
  let allFrames2 = getAllFramesInWindow(win2);

  if (anyMatch(allFrames1, allFrames2)) {
    return true;
  }

  let opener1 = getOpener(top1);
  let opener2 = getOpener(top2);

  if (opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2)) {
    return false;
  }

  if (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1)) {
    return false;
  }
}

function anyMatch(collection1, collection2) {
  for (let item1 of collection1) {
    for (let item2 of collection2) {
      if (item1 === item2) {
        return true;
      }
    }
  }
}

function testStuff() {
  const win = getOpener(window);
  const nbfb = needsBridgeForBrowser();
  const nbfw = needsBridgeForWin(win);
  const nbfd = needsBridgeForDomain(undefined, win);

  alert(
    JSON.stringify({
      needsBridgeForWin: nbfw,
      needsBridgeForDomain: nbfd,
      needsBridgeForBrowser: nbfb,
    }),
  );
}
