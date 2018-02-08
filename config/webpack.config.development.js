const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
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
    crossOriginLoading: 'use-credentials'
  },
  cache: true,
  devtool: 'source-map',
  entry: {
    webchat: [
      'babel-polyfill',
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      'development',
    ],
    sdk: ['babel-polyfill', './SDK/src/index.js'],
    extensionSdk: ['babel-polyfill', './Extensions/src/ExtensionSdk.js'],
    webchatMain: './config/templates/webchatMain.js',
    postRobotBridge: './node_modules/post-robot/dist/post-robot.ie.js',
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
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    // Uncomment this if we ever use a common chunk
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: '[name].js',
    //   minChunks: Infinity,
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../app/components'),
          path.resolve(__dirname, '../SDK/src/components'),
          path.resolve(__dirname, '../node_modules/emoji-mart'),
          path.resolve(__dirname, '../node_modules/draft-js-twemoji-plugin'),
          path.resolve(__dirname, '../node_modules/draft-js'),
        ],
        use: [
          {loader: 'style-loader', options: {sourceMap: true}},
          {loader: 'css-loader', options: {sourceMap: true, sourceMapContents: true}},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [autoprefixer()]
            },
          },
          {loader: 'namespace-css-loader', query: '#quiqWebChat'},  // Use 'query' instead of 'options' for compatibility
          {
            loader: 'sass-loader',
            options: {sourceMap: true, sourceMapContents: true, outputStyle: 'expanded'},
          },
        ],
      },
      {
        test: /\.(wav|mp3)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/audio/[name].[ext]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/[name].[ext]',
        },
      },
    ],
  },
});
