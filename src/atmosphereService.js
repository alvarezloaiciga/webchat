import atmosphere from 'atmosphere.js'

let connection, onConnectionLoss, onConnectionEstablish, handleMessage;

export const connectSocket = (tenant, endpoint, host, userId,
                              _onConnectionLoss, _onConnectionReestablish, _handleMessage) => {
  onConnectionLoss = _onConnectionLoss;
  onConnectionEstablish = _onConnectionReestablish;
  handleMessage = _handleMessage;

  const req = buildRequest(tenant, endpoint, host, userId);
  connection = atmosphere.subscribe(req);
};

export const disconnectSocket = () => {
  connection && connection.unsubscribe();
};

const buildRequest = (tenant, endpoint, host, userId) => ({
    url: `https://${tenant}.${host}/websocket/webchat/${tenant}/${endpoint}/${userId}`,
    enableXDR: true,
    withCredentials: true,
    contentType: 'application/json',
    logLevel: 'error',
    transport: 'websocket',
    fallbackTransport: 'long-polling',
    trackMessageLength: true,
    maxReconnectOnClose: Number.MAX_SAFE_INTEGER,
    // Keep reconnectInterval at 10 seconds.  Otherwise if API-GW drops the atmosphere connection,
    // we will hammer them with onReconnect requests. See SER-2620
    reconnectInterval: 10000,
    onOpen, onClose, onReopen, onReconnect, onMessage, onTransportFailure, onError, onClientTimeout,
});

/******** Atmosphere callbacks *********/
const onOpen = (response) => {
  // Carry the UUID. This is required if you want to call subscribe(request) again.
  connection.request.uuid = response.request.uuid;
  onConnectionEstablish && onConnectionEstablish();
  console.log("Socket open");
};

const onReopen = () => {
  console.log("Socket reopened");
  onConnectionEstablish && onConnectionEstablish();
};

const onReconnect = (req, res) => {
    // Long-polling doesn't clear up the error until it gets something back from the server
    // Force this to happen by sending a ping.
    /*clearTimeout(connection.pingTimeout);
    if (req.transport === 'long-polling') {
      connection.pingTimeout = setTimeout(() => {
        ping();
      }, connection.request.reconnectInterval + 5000);
    }*/
    console.log("Atmosphere: reconnect");
};

const onMessage = (res) => {
  let message;
  try {
    message = atmosphere.util.parseJSON(res.responseBody);
    handleMessage && handleMessage(message);
  } catch (e) {
    console.error("Error parsing Quiq websocket message");
    return;
  }

  console.log(message);
};

const onTransportFailure = (errorMsg, req) => {
  console.log(`Transport failed: ${req.transport}`);
};

const onError = (res) => {
  console.log("Atmosphere error");
  onConnectionLoss && onConnectionLoss();
};

const onClientTimeout = (req) => {
  console.log("Atmosphere client timeout");
  onConnectionLoss && onConnectionLoss();
};

const onClose = (res) => {
  console.log("Atmosphere connection closed");
};