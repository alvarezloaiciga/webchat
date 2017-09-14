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

  if (protocol === CONSTANTS.FILE_PROTOCOL) {
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

  if (domain && win.mockDomain && win.mockDomain.indexOf(CONSTANTS.MOCK_PROTOCOL) === 0) {
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

function getAllFramesInWindow(win: any) {
  let top = getTop(win);
  return getAllChildFrames(top).concat(top);
}

function isTop(win: any): boolean {
  return win === getTop(win);
}

function isFrameWindowClosed(frame: HTMLIFrameElement): boolean {
  if (!frame.contentWindow) {
    return true;
  }

  if (!frame.parentNode) {
    return true;
  }

  let doc = frame.ownerDocument;

  if (doc && doc.body && !doc.body.contains(frame)) {
    return true;
  }

  return false;
}

let iframeWindows = [];
let iframeFrames = [];

function isWindowClosed(win: any, allowMock: boolean = true) {
  try {
    if (win === window) {
      return false;
    }
  } catch (err) {
    return true;
  }

  try {
    if (!win) {
      return true;
    }
  } catch (err) {
    return true;
  }

  try {
    if (win.closed) {
      return true;
    }
  } catch (err) {
    // I love you so much IE

    if (err && err.message === 'Call was rejected by callee.\r\n') {
      return false;
    }

    return true;
  }

  if (allowMock && isSameDomain(win)) {
    try {
      if (win.mockclosed) {
        return true;
      }
    } catch (err) {
      // pass
    }
  }

  // Mobile safari

  try {
    if (!win.parent || !win.top) {
      return true;
    }
  } catch (err) {
    // pass
  }

  // IE orphaned frame

  try {
    let index = iframeWindows.indexOf(win);

    if (index !== -1) {
      let frame = iframeFrames[index];

      if (frame && isFrameWindowClosed(frame)) {
        return true;
      }
    }
  } catch (err) {
    // pass
  }

  return false;
}

function cleanIframes() {
  for (let i = 0; i < iframeFrames.length; i++) {
    if (isFrameWindowClosed(iframeFrames[i])) {
      iframeFrames.splice(i, 1);
      iframeWindows.splice(i, 1);
    }
  }

  for (let i = 0; i < iframeWindows.length; i++) {
    if (isWindowClosed(iframeWindows[i])) {
      iframeFrames.splice(i, 1);
      iframeWindows.splice(i, 1);
    }
  }
}

function linkFrameWindow(frame: HTMLIFrameElement) {
  cleanIframes();

  if (frame && frame.contentWindow) {
    try {
      iframeWindows.push(frame.contentWindow);
      iframeFrames.push(frame);
    } catch (err) {
      // pass
    }
  }
}

function getUserAgent(win: any) {
  win = win || window;
  return win.navigator.mockUserAgent || win.navigator.userAgent;
}

function getFrameByName(win: any, name: string) {
  let winFrames = getFrames(win);

  for (let childFrame of winFrames) {
    try {
      if (
        isSameDomain(childFrame) &&
        childFrame.name === name &&
        winFrames.indexOf(childFrame) !== -1
      ) {
        return childFrame;
      }
    } catch (err) {
      // pass
    }
  }

  try {
    if (winFrames.indexOf(win.frames[name]) !== -1) {
      return win.frames[name];
    }
  } catch (err) {
    // pass
  }

  try {
    if (winFrames.indexOf(win[name]) !== -1) {
      return win[name];
    }
  } catch (err) {
    // pass
  }
}

function findChildFrameByName(win: any, name: string) {
  let frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  for (let childFrame of getFrames(win)) {
    let namedFrame = findChildFrameByName(childFrame, name);

    if (namedFrame) {
      return namedFrame;
    }
  }
}

function findFrameByName(win: any, name: string) {
  let frame;

  frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  return findChildFrameByName(getTop(win), name);
}

function isParent(win: any, frame: any) {
  let frameParent = getParent(frame);

  if (frameParent) {
    return frameParent === win;
  }

  for (let childFrame of getFrames(win)) {
    if (childFrame === frame) {
      return true;
    }
  }

  return false;
}

function isOpener(parent: any, child: any) {
  return parent === getOpener(child);
}

function getAncestor(win: any) {
  win = win || window;

  let opener = getOpener(win);

  if (opener) {
    return opener;
  }

  let parent = getParent(win);

  if (parent) {
    return parent;
  }
}

function getAncestors(win: any) {
  let results = [];

  let ancestor = win;

  while (ancestor) {
    ancestor = getAncestor(ancestor);
    if (ancestor) {
      results.push(ancestor);
    }
  }

  return results;
}

function isAncestor(parent: any, child: any) {
  let actualParent = getAncestor(child);

  if (actualParent) {
    if (actualParent === parent) {
      return true;
    }

    return false;
  }

  if (child === parent) {
    return false;
  }

  if (getTop(child) === child) {
    return false;
  }

  for (let frame of getFrames(parent)) {
    if (frame === child) {
      return true;
    }
  }

  return false;
}

function isPopup() {
  return Boolean(getOpener(window));
}

function isIframe() {
  return Boolean(getParent(window));
}

function isFullpage() {
  return Boolean(!isIframe() && !isPopup());
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

function getDistanceFromTop(win: any = window) {
  let distance = 0;

  while (win) {
    win = getParent(win);
    if (win) {
      distance += 1;
    }
  }

  return distance;
}

function getNthParent(win: any, n: number = 1) {
  for (let i = 0; i < n; i++) {
    win = getParent(win);
  }
  return win;
}

function getNthParentFromTop(win: any, n: number = 1) {
  return getNthParent(win, getDistanceFromTop(win) - n);
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

function matchDomain(pattern: any, origin: any) {
  if (typeof pattern === 'string') {
    if (typeof origin === 'string') {
      return pattern === CONSTANTS.WILDCARD || origin === pattern;
    }

    if (isRegex(origin)) {
      return false;
    }

    if (Array.isArray(origin)) {
      return false;
    }
  }

  if (isRegex(pattern)) {
    if (isRegex(origin)) {
      return pattern.toString() === origin.toString();
    }

    if (Array.isArray(origin)) {
      return false;
    }

    return Boolean(origin.match(pattern));
  }

  if (Array.isArray(pattern)) {
    if (Array.isArray(origin)) {
      return JSON.stringify(pattern) === JSON.stringify(origin);
    }

    if (isRegex(origin)) {
      return false;
    }

    return pattern.some(subpattern => matchDomain(subpattern, origin));
  }

  return false;
}

function getDomainFromUrl(url: string) {
  let domain;

  if (url.match(/^(https?|mock|file):\/\//)) {
    domain = url;
  } else {
    return getDomain();
  }

  domain = domain
    .split('/')
    .slice(0, 3)
    .join('/');

  return domain;
}

function onCloseWindow(
  win: any,
  callback: Function,
  delay: number = 1000,
  maxtime: number = Infinity,
): {cancel: () => void} {
  let timeout;

  let check = () => {
    if (isWindowClosed(win)) {
      if (timeout) {
        clearTimeout(timeout);
      }

      return callback();
    }

    if (maxtime <= 0) {
      clearTimeout(timeout);
    } else {
      maxtime -= delay;
      timeout = setTimeout(check, delay);
    }
  };

  check();

  return {
    cancel() {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
  };
}

function isWindow(obj: Object) {
  try {
    if (obj && obj.self === obj) {
      return true;
    }
  } catch (err) {
    // pass
  }

  return false;
}

function needsBridgeForBrowser() {
  if (getUserAgent(window).match(/MSIE|trident|edge/i)) {
    return true;
  }

  return false;
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

function needsBridgeForWin(win: any) {
  if (!isSameTopWindow(window, win)) {
    return true;
  }

  return false;
}

function needsBridgeForDomain(domain: ?string, win: any) {
  if (domain) {
    if (getDomain() !== getDomainFromUrl(domain)) {
      return true;
    }
  } else if (win) {
    if (!isSameDomain(win)) {
      return true;
    }
  }

  return false;
}

function needsBridge({win, domain}: {win: any, domain?: string}) {
  if (!needsBridgeForBrowser()) {
    return false;
  }

  if (domain && !needsBridgeForDomain(domain, win)) {
    return false;
  }

  if (win && !needsBridgeForWin(win)) {
    return false;
  }

  return true;
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
