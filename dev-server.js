const path = require('path');
const express = require('express');
const webpack = require('webpack');
const cookieParser = require('cookie-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');

var app = require('express')();
var server = require('https').createServer(require('./devssl'), app);
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin({ port: 9840 }));

require('fs').readFile(require('path').join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.centricient', 'ui-override.json'), 'utf8', function(err, data) {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch(e){}
  let webchatData;
  if(parsedData) {
    webchatData = parsedData.find(d => d.name === 'webchat');
  }

  let tenant, port, cluster;
  port = 3000;
  cluster = 'dev';
  if(webchatData) {
    tenant = webchatData.tenant;
    cluster = webchatData.cluster || cluster;
    port = webchatData.port || port;
  }

  tenant = tenant || process.env.TENANT;
  if (!tenant) {
    console.error("\n\nERROR!!! You must provide a tenant to run webchat locally!'\n\n");
    process.exit(1);
  }
  else {
    app.use(cookieParser());
    app.use(function (req, res, next) {
      res.cookie('host', ('https://' + tenant + '.quiq.dev:' + port), { maxAge: 900000 });
      next();
    });
  }

  var apiGatewayProxySettings = {
    target: require('./discovery')(tenant).readLocalSettings()['api-gateway'] || 'https://' + tenant + '.' + cluster + '.quiq.sh',
    secure: false,
    headers: {
      Host: tenant + '.quiq.dev:' + port
    }
  };

  console.log('Proxying to API Gateway at ' + apiGatewayProxySettings.target);

  var proxy = require('http-proxy').createProxyServer(apiGatewayProxySettings);

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
  server.on('upgrade', function(req, socket, head) {
    console.log( '---------- SOCKET CONNECTION UPGRADING ----------' );
    proxy.ws(req, socket, head);
  });
  proxy.on('error', function (err, req, res) {
    console.log('Something went wrong during proxy...');
    console.log(err);
  });

  app.use(require('morgan')('dev'));
  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
  }));
  app.use('/assets', express.static('assets'));

  app.get('/app/webchat/bridge*', (req, res) => {
    res.sendFile(path.join(__dirname, './bridge/index.html'));
  });

  app.get('/app/webchat*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './local.html'));
  });

  app.all('/external/*', proxyToApiGateway);
  app.all('/websocket/*', proxyToApiGateway);
  app.all('/messaging/*', proxyToApiGateway);
  app.all('/idp/*', proxyToApiGateway);
  app.all('/server/*', proxyToApiGateway);
  app.all('/landing', proxyToApiGateway);
  app.all('/landing/*', proxyToApiGateway);
  app.all('/session/*', proxyToApiGateway);
  app.all('/session', proxyToApiGateway);
  app.all('/sessions', proxyToApiGateway);
  app.all('/debug', proxyToApiGateway);
  app.all('/debug/*', proxyToApiGateway);
  app.all('/web/*', proxyToApiGateway);
  app.all('/perma/*', proxyToApiGateway);
  app.all('/app/webchat/*', proxyToApiGateway);
  app.all('/app/chat-demo/', proxyToApiGateway);
  app.all('/api/*', proxyToApiGateway);

  server.listen(port, function() {
    console.log('Server running on: https://%s.quiq.dev:%s', tenant, port);
    console.log('Server ready for clients. \\m/ x__x \\m/');
  });
});
