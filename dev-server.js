const path = require('path');
const express = require('express');
const webpack = require('webpack');
const cookieParser = require('cookie-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');

const app = express();
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

require('fs').readFile(require('path').join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.centricient', 'ui-override.json'), 'utf8', function(err, data) {
  const parsedData = JSON.parse(data);
  const webchatData = parsedData.find(d => d.name === 'webchat');

  let tenant, host, port;
  let host = 'localhost';
  let port = 3000;
  if(webchatData) {
    tenant = webchatData.tenant;
    host = webchatData.host || host;
    port = webchatData.port || port;
  }

  if (!tenant) {
    console.error("\n\nERROR!!! You must provide a tenant in your ~/.centricient/ui-override.json file'\n\n");
    process.exit(1);
  }
  else {
    app.use(cookieParser());
    app.use(function (req, res, next) {
      res.cookie('tenant', tenant, { maxAge: 900000 });
      next();
    });
  }

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    historyApiFallback: true
  }));

  app.use(require('morgan')('dev'));
  app.use(webpackHotMiddleware(compiler));

  app.get('/app/webchat/standalone*', (req, res) => {
    res.sendFile(path.join(__dirname, './standalone/index.html'));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
  });

  app.listen(port, host, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`🚧  App is listening at http://${host}:${port} 🚧`);
  });
});
