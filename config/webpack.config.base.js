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
      'node_modules',
    ],
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
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  postcss() {
    return [autoprefixer()];
  },
};
