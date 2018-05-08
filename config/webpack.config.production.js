/* eslint-disable no-console */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const {version} = require('../package.json');

const commitHash = process.env.GIT_COMMIT || 'dev';
const uniqueUrlPiece = `${version}-${commitHash.substring(0, 8)}`;
console.log(`uniqueUrlPiece is ${uniqueUrlPiece}`);

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
};

module.exports = merge(config, {
  output: {
    filename: `[name]-[chunkhash]-${uniqueUrlPiece}.js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'https://static.quiq-cdn.com/webchat/',
    crossOriginLoading: 'anonymous',
  },
  devtool: 'source-map',
  entry: {
    webchat: ['babel-polyfill', 'production'],
    sdk: ['babel-polyfill', './SDK/src/index.js'],
    extensionSdk: ['babel-polyfill', './Extensions/src/ExtensionSdk.js'],
    webchatMain: './config/templates/webchatMain.js',
    postRobotBridge: './node_modules/post-robot/dist/post-robot.ie.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'config/templates/webchat.html.ejs',
      filename: `webchat.html`,
      inject: false,
      chunks: ['webchat', 'webchatMain'],
    }),
    new HtmlWebpackPlugin({
      template: 'config/templates/bridge.html.ejs',
      filename: `bridge.html`,
      inject: false,
      chunks: ['postRobotBridge'],
    }),
    new HtmlWebpackPlugin({
      template: 'config/templates/testWaitScreen.ejs',
      filename: `testWaitScreen.html`,
      inject: false,
      chunks: [],
    }),
    new HtmlWebpackPlugin({
      template: 'config/templates/server.conf.ejs',
      filename: 'server.conf',
      inject: false,
      chunks: ['sdk', 'extensionSdk'],
    }),
    // Uncomment this if we ever use assets
    // new CopyWebpackPlugin([
    //   {
    //     from: 'app/assets',
    //     to: 'assets',
    //   },
    // ]),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // Uncomment this if we ever use a common chunk
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: `[name]-[chunkhash]-${uniqueUrlPiece}.js`,
    //   minChunks: Infinity,
    // }),
    new ExtractTextPlugin({
      filename: `[name]-[chunkhash]-${uniqueUrlPiece}.css`,
      allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../app/components'),
          path.resolve(__dirname, '../node_modules/emoji-mart'),
          path.resolve(__dirname, '../node_modules/draft-js-twemoji-plugin'),
          path.resolve(__dirname, '../node_modules/draft-js'),
        ],

        // For the app's css
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true}},
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [autoprefixer()],
              },
            },
            {loader: 'namespace-css-loader', query: '#quiqWebChat'},
            {loader: 'sass-loader', options: {outputStyle: 'compressed'}},
          ],
        }),
      },
      // For the SDK's css
      {
        test: /\.s?css$/,
        include: [path.resolve(__dirname, '../SDK/src/components')],
        use: [
          'style-loader',
          {loader: 'css-loader', options: {sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [autoprefixer()],
            },
          },
          {loader: 'namespace-css-loader', query: '#quiqWebChat'}, // Use 'query' instead of 'options' for compatibility
          {loader: 'sass-loader', options: {outputStyle: 'compressed'}},
        ],
      },
    ],
  },
});
