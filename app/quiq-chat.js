'use strict';

Object.defineProperty(exports, '__esModule', {value: true});

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var fetch = _interopDefault(require('isomorphic-fetch'));
var uaParserJs = require('ua-parser-js');
var atmosphere = _interopDefault(require('atmosphere.js'));

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

//
/**
 * Formats the params object as query params in the url
 */
var formatQueryParams = function formatQueryParams(url, params) {
  var paramStrings = [];

  if (!params) {
    return url;
  }

  Object.keys(params).forEach(function(key) {
    var value = params[key];

    // If it's an array, we need to push once for each item
    if (Array.isArray(value)) {
      paramStrings.push.apply(
        paramStrings,
        _toConsumableArray(
          value.map(function(v) {
            return key + '=' + v;
          }),
        ),
      );
    } else if (value !== undefined) {
      paramStrings.push(key + '=' + value);
    }
  });

  if (paramStrings.length === 0) {
    return url;
  }

  return url + '?' + paramStrings.join('&');
};

var parser = new uaParserJs.UAParser();
var getBrowserName = function getBrowserName() {
  return parser.getResult().browser.name;
};
var getMajor = function getMajor() {
  return parseInt(parser.getResult().browser.major, 10);
};

var isIE9 = function isIE9() {
  return getBrowserName() === 'IE' && getMajor() <= 9;
};

//

var quiqChatSettings = void 0;

var setGlobals = function setGlobals(globals) {
  quiqChatSettings = globals;
};

var checkRequiredSettings = function checkRequiredSettings() {
  if (!quiqChatSettings || !quiqChatSettings.HOST || !quiqChatSettings.CONTACT_POINT) {
    throw new Error(
      '\n      HOST and CONTACT_POINT must be configured to call Quiq Messaging.\n      Did you forget to call init?\n      ',
    );
  }
};

var getContactPoint = function getContactPoint() {
  return quiqChatSettings.CONTACT_POINT;
};

var getPublicApiUrl = function getPublicApiUrl() {
  return quiqChatSettings.HOST + '/api/v1/messaging';
};

var getUrlForContactPoint = function getUrlForContactPoint() {
  return quiqChatSettings.HOST + '/api/v1/messaging/chat/' + quiqChatSettings.CONTACT_POINT;
};

//
var parseResponse = function parseResponse(response) {
  if (response.status && response.status >= 300) {
    return response
      .json()
      .then(function(res) {
        return Promise.reject(res);
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
  }

  return response.json();
};

var joinChat$1 = function joinChat() {
  fetch(getUrlForContactPoint() + '/join', {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

var leaveChat$1 = function leaveChat() {
  fetch(getUrlForContactPoint() + '/leave', {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

var addMessage$1 = function addMessage(text) {
  fetch(getUrlForContactPoint() + '/send-message', {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text: text}),
  });
};

var fetchWebsocketInfo = function fetchWebsocketInfo() {
  return fetch(getUrlForContactPoint() + '/socket-info', {
    mode: 'cors',
    credentials: 'include',
  }).then(parseResponse);
};

// Use socket-info as a ping since the ping endpoint isn't publicly exposed
var ping = function ping() {
  return fetchWebsocketInfo();
};

var fetchConversation$1 = function fetchConversation() {
  return fetch('' + getUrlForContactPoint(), {
    mode: 'cors',
    credentials: 'include',
  }).then(parseResponse);
};

var updateMessagePreview$1 = function updateMessagePreview(text, typing) {
  fetch(getUrlForContactPoint() + '/typing', {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text: text, typing: typing}),
  });
};

var checkForAgents$1 = function checkForAgents() {
  return fetch(
    formatQueryParams(getPublicApiUrl() + '/agents-available', {
      platform: 'Chat',
      contactPoint: getContactPoint(),
    }),
    {
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  ).then(parseResponse);
};

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

//
var connection = void 0;
var callbacks = void 0;
var ie9Ping = void 0;

var buildRequest = function buildRequest(socketUrl) {
  // TODO: Add a way to specify transport
  var transport = 'websocket';
  if (isIE9()) {
    transport = 'jsonp';
  }

  /* eslint-disable no-use-before-define */
  return {
    url: 'https://' + socketUrl,
    enableXDR: true,
    withCredentials: true,
    contentType: 'application/json',
    logLevel: 'error',
    transport: transport,
    fallbackTransport: 'long-polling',
    trackMessageLength: true,
    maxReconnectOnClose: Number.MAX_SAFE_INTEGER,
    // Keep reconnectInterval at 10 seconds.  Otherwise if API-GW drops the atmosphere connection,
    // we will hammer them with onReconnect requests. See SER-2620
    reconnectInterval: 10000,
    onOpen: onOpen,
    onClose: onClose,
    onReopen: onReopen,
    onReconnect: onReconnect,
    onMessage: onMessage,
    onTransportFailure: onTransportFailure,
    onError: onError,
    onClientTimeout: onClientTimeout,
  };
  /* eslint-disable no-use-before-define */
};

var connectSocket = function connectSocket(builder) {
  var socketUrl = builder.socketUrl, websocketCallbacks = builder.callbacks;

  callbacks = websocketCallbacks;

  if (isIE9() && !ie9Ping) {
    // JSONP seems to be a bit unreliable, but we can prod it by periodically pinging the server...
    ie9Ping = setInterval(ping, 2000);
  }

  connection = _extends({}, atmosphere.subscribe(buildRequest(socketUrl)));
};

// ******** Atmosphere callbacks *********
var onOpen = function onOpen(response) {
  // Carry the UUID. This is required if you want to call subscribe(request) again.
  connection.request.uuid = response.request.uuid;
  callbacks.onConnectionEstablish && callbacks.onConnectionEstablish();
};

var onReopen = function onReopen() {
  callbacks.onConnectionEstablish && callbacks.onConnectionEstablish();
};

var onReconnect = function onReconnect(req) {
  // Long-polling doesn't clear up the error until it gets something back from the server
  // Force this to happen by sending a ping.
  clearTimeout(connection.pingTimeout);
  if (req.transport === 'long-polling') {
    connection.pingTimeout = setTimeout(function() {
      ping();
    }, connection.request.reconnectInterval + 5000);
  }
};

var onMessage = function onMessage(res) {
  var message = void 0;
  try {
    message = atmosphere.util.parseJSON(res.responseBody);
    callbacks.onMessage && callbacks.onMessage(message);
  } catch (e) {
    console.error('Error parsing Quiq websocket message');
    return;
  }
};

var onTransportFailure = function onTransportFailure(errorMsg, req) {
  callbacks.onTransportFailure && callbacks.onTransportFailure(errorMsg, req);
};

var onError = function onError() {
  callbacks.onConnectionLoss && callbacks.onConnectionLoss();
};

var onClientTimeout = function onClientTimeout() {
  callbacks.onConnectionLoss && callbacks.onConnectionLoss();
};

var onClose = function onClose() {
  callbacks.onClose && callbacks.onClose();
};

var _this = undefined;

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}

//
var init = function init(settings) {
  var defaults = {
    CONTACT_POINT: 'default',
  };

  var globals = Object.assign({}, defaults, settings);

  setGlobals(globals);
};

var subscribe = (function() {
  var _ref = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee(callbacks) {
      var wsInfo;
      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                checkRequiredSettings();
                _context.next = 3;
                return fetchWebsocketInfo();

              case 3:
                wsInfo = _context.sent;

                connectSocket({socketUrl: wsInfo.url, callbacks: callbacks});

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        _this,
      );
    }),
  );

  return function subscribe(_x) {
    return _ref.apply(this, arguments);
  };
})();

var joinChat$$1 = function joinChat$$1() {
  checkRequiredSettings();
  return joinChat$1();
};

var leaveChat$$1 = function leaveChat$$1() {
  checkRequiredSettings();
  return leaveChat$1();
};

var addMessage$$1 = function addMessage$$1(text) {
  checkRequiredSettings();
  return addMessage$1(text);
};

var fetchConversation$$1 = function fetchConversation$$1() {
  checkRequiredSettings();
  return fetchConversation$1();
};

var updateMessagePreview$$1 = function updateMessagePreview$$1(text, typing) {
  checkRequiredSettings();
  return updateMessagePreview$1(text, typing);
};

var checkForAgents$$1 = function checkForAgents$$1() {
  checkRequiredSettings();
  return checkForAgents$1();
};

exports.init = init;
exports.subscribe = subscribe;
exports.joinChat = joinChat$$1;
exports.leaveChat = leaveChat$$1;
exports.addMessage = addMessage$$1;
exports.fetchConversation = fetchConversation$$1;
exports.updateMessagePreview = updateMessagePreview$$1;
exports.checkForAgents = checkForAgents$$1;
