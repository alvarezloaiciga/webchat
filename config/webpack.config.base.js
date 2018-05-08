// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const version = require('../package.json').version;
const SriPlugin = require('webpack-subresource-integrity');

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
      path.join(__dirname, '../Extensions/src'),
      'node_modules',
    ],
    alias: {
      Common: path.join(__dirname, '../Common'),
    },
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new SriPlugin({
      hashFuncNames: ['sha256'],
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules\/(?!(core-ui)\/).*/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, '../node_modules/hodash.get'), // Needed since hodash does not transpile itself
          path.resolve(__dirname, '../node_modules/redux-store-watch'), // Needed since redux-store-watch does not transpile itself
        ],
      },
      {
        test: /\.(wav|mp3|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `assets/[name]-[sha1:hash:hex:8].[ext]`,
          },
        },
      },
    ],
  },
};
