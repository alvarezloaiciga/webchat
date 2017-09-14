const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const publicPath = '/app/webchat/';
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
    publicPath,
  },
  debug: true,
  cache: true,
  devtool: 'eval',
  entry: {
    webchat: ['babel-polyfill', 'react-hot-loader/patch', 'development'],
    sdk: ['babel-polyfill', './SDK/src/index.js'],
    webchatMain: './config/templates/webchatMain.js',
    postRobotBridge: './node_modules/post-robot/dist/post-robot.ie.min.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'config/templates/webchat.html.ejs',
      filename: 'webchat.html',
      inject: false,
      chunks: ['webchat', 'webchatMain'],
    }),
    new HtmlWebpackPlugin({
      template: 'config/templates/bridge.html.ejs',
      filename: 'bridge.html',
      inject: false,
      chunks: ['postRobotBridge'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    // Uncomment this if we ever use a common chunk
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: '[name].js',
    //   minChunks: Infinity,
    // }),
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../app/components')],
        loaders: [
          {loader: 'style', query: {sourceMap: true, sourceMapContents: true}},
          {loader: 'css', query: {sourceMap: true, sourceMapContents: true}},
          'postcss',
          {loader: 'namespace-css', query: '#quiqWebChat'},
          {
            loader: 'sass',
            query: {sourceMap: true, sourceMapContents: true, outputStyle: 'expanded'},
          },
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
