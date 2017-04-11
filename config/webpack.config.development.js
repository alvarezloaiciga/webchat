const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('development'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true')),
};

module.exports = merge(config, {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  debug: true,
  cache: true,
  devtool: 'eval',
  entry: {
    webchat: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      'development',
    ],
    common: ['react', 'react-dom' ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: '[name].js',
      minChunks: Infinity,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../app/components'),
        ],
        loaders: [
          'style',
          'css',
          'postcss',
          { loader: 'namespace-css', query: '#quiqWebChat' },
          { loader: 'sass', query: { outputStyle: 'expanded' } },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'assets/[name].[ext]',
        },
      },
    ],
  },
});
