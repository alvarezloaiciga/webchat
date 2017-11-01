// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const version = require('../package.json').version;

const GLOBALS = {
  __VERSION__: `'${version}'`,
};

module.exports = {
  resolve: {
    modules: [
      path.join(__dirname, '../config/scripts'),
      path.join(__dirname, '../app'),
      path.join(__dirname, '../app/assets'),
      path.join(__dirname, '../app/components'),
      path.join(__dirname, '../app/styles'),
      path.join(__dirname, '../SDK/src'),
      'node_modules',
    ],
    alias: {
      Common: path.join(__dirname, '../Common'),
    },
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules\/(?!(core-ui)\/).*/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, '../node_modules/hodash.get'), // Needed since hodash does not transpile itself
          path.resolve(__dirname, '../node_modules/redux-store-watch'), // Needed since redux-store-watch does not transpile itself
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  postcss() {
    return [autoprefixer()];
  },
};
