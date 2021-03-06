const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./config/webpack.config.development');

var webchatApp = require('express')();
var webchatServer = require('https').createServer(require('./devssl'), webchatApp);

require('fs').readFile(require('path').join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.centricient', 'ui-override.json'), 'utf8', function (err, data) {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch(e){}
  let webchatData;
  if (parsedData) {
    webchatData = parsedData.find(d => d.name === 'webchat');
  }

  let tenant, cluster;
  const webchatPort = 3000;
  const sdkPort = 3001;
  cluster = 'dev';
  if (webchatData) {
    tenant = webchatData.tenant;
    cluster = webchatData.cluster || cluster;
  }

  tenant = tenant || process.env.TENANT;
  if (!tenant) {
    console.error("\n\nERROR!!! You must provide a tenant to run webchat locally!'\n\n");
    process.exit(1);
  }

  const webchatHost = ('https://' + tenant + '.quiq.dev:' + webchatPort);

  var apiGatewayProxySettings = {
    target: require('./discovery')(tenant).readLocalSettings()['api-gateway']
      || webchatData.host ? `https://${webchatData.host}` : ('https://' + tenant + '.' + cluster + '.quiq.sh'),
    secure: false,
    headers: {
      Host: webchatData.host || (tenant + '.quiq.dev:' + webchatPort)
    }
  };

  var assetsProxySettings = {
    target: webchatHost,
    secure: false,
    headers: {
      Host: webchatHost
    }
  };

  console.log('Proxying to API Gateway at ' + apiGatewayProxySettings.target);

  var proxy = require('http-proxy').createProxyServer(apiGatewayProxySettings);
  var assetsProxy = require('http-proxy').createProxyServer(assetsProxySettings);

  var proxyToApiGateway = function (req, res) {
    if (req.url.indexOf('long-polling') !== -1) {
      console.log('Sending long-polling request to server...');
    }

    proxy.web(req, res, apiGatewayProxySettings);
  };

  proxy.on('proxyReqWs', function (proxyReqWs, req, res) {
    console.log('Proxy *WS* Request', proxyReqWs.path);
  });
  // proxy the WS requests
  webchatServer.on('upgrade', function (req, socket, head) {
    console.log('---------- SOCKET CONNECTION UPGRADING ----------');
    proxy.ws(req, socket, head);
  });
  proxy.on('error', function (err, req, res) {
    console.log('Something went wrong during proxy...');
    console.log(err);
  });

  webchatApp.use(require('morgan')('dev'));

  // Webpack will serve: webchat.html, bridge.html, sdk.js, webchat,js
  const compiler = webpack(config);
  webchatApp.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      assets: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: true,
      excludeAssets: /app\/assets/,
      excludeModules: /\/node_modules\/(?!(core-ui|core-agent-ui)\/).*/,
      hash: false,
      maxModules: 15,
      modules: false,
      performance: true,
      reasons: false,
      source: false,
      timings: true,
      version: false,
      warnings: true,
    },
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }));

  webchatApp.use(webpackHotMiddleware(compiler));
  webchatApp.set('view engine', 'ejs');

  // This allows the playground to run on same host as webchat. Useful for testing edge case of goquiq.com chat
  webchatApp.get('/', (req, res) => {
    res.render('./playground', {host: webchatHost});
  });
  // Testbed
  webchatApp.get('/testbed', (req, res) => {
    res.render('./testbed', {host: webchatHost});
  });

  var proxyAssets = function (req, res) {
    assetsProxy.web(req, res, assetsProxySettings);
  };

  webchatApp.all('/external/*', proxyToApiGateway);
  webchatApp.all('/websocket/*', proxyToApiGateway);
  webchatApp.all('/socket/*', proxyToApiGateway);
  webchatApp.all('/messaging/*', proxyToApiGateway);
  webchatApp.all('/idp/*', proxyToApiGateway);
  webchatApp.all('/server/*', proxyToApiGateway);
  webchatApp.all('/landing', proxyToApiGateway);
  webchatApp.all('/landing/*', proxyToApiGateway);
  webchatApp.all('/session/*', proxyToApiGateway);
  webchatApp.all('/session', proxyToApiGateway);
  webchatApp.all('/sessions', proxyToApiGateway);
  webchatApp.all('/debug', proxyToApiGateway);
  webchatApp.all('/debug/*', proxyToApiGateway);
  webchatApp.all('/web/*', proxyToApiGateway);
  webchatApp.all('/perma/*', proxyToApiGateway);
  webchatApp.all('/app/webchat/*', proxyToApiGateway);
  webchatApp.all('/app/chat-demo/', proxyToApiGateway);
  webchatApp.all('/api/*', proxyToApiGateway);

  webchatServer.listen(webchatPort, function () {
    console.log('Webchat app server running on: %s', webchatHost);
    console.log('Webchat will proxy requests. \\m/ x__x \\m/');
  });

  // Playground server
  // The sole purpose here is to serve the 'customer' page on a different port than the webchat app
  // This gives us a realistic cross-domain dev environment
  var playgroundApp = require('express')();
  var playgroundServer = require('https').createServer(require('./devssl'), playgroundApp);

  playgroundApp.set('view engine', 'ejs');
  playgroundApp.use(require('morgan')('dev'));

  playgroundApp.all('/app/webchat/assets/*', proxyAssets);

  // Playground
  playgroundApp.get('/', (req, res) => {
    res.render('./playground', {host: webchatHost, tenant});
  });

  // Testbed
  playgroundApp.get('/testbed', (req, res) => {
    res.render('./testbed', {host: webchatHost});
  });

  playgroundApp.get('/popup-test', (req, res) => {
    res.render('./popupTest', {});
  });

  // R*
  playgroundApp.get('/rockstar', (req, res) => {
    res.render('./rockstar', {host: webchatHost});
  });

  // Test Extension
  playgroundApp.get('/testExtension', (req, res) => {
    res.render('./testExtension', {host: webchatHost});
  });

  playgroundServer.listen(sdkPort, function () {
    console.log('Playground server running on: https://%s.quiq.dev:%s', tenant, sdkPort);
  });
});
