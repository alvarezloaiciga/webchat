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
    extensions: ['.js', '.scss'],
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
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../SDK'),
          path.resolve(__dirname, '../Common'),
        ],
        loader: 'babel',
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
