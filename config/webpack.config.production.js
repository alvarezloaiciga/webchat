/* eslint-disable no-console */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const {version} = require('../package.json');

const cdnUrl = process.env.QUIQ_CDN;
const publicPath = cdnUrl ? `${cdnUrl}webchat/` : './';
const commitHash = process.env.GIT_COMMIT || 'dev';
const uniqueUrlPiece = `${version}-${commitHash.substring(0, 8)}`;
console.log(`Public Path is ${publicPath}`);
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
    publicPath,
  },
  debug: false,
  devtool: 'source-map',
  entry: {
    webchat: ['babel-polyfill', 'production'],
    sdk: ['babel-polyfill', './SDK/src/index.js'],
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
      template: 'config/templates/server.conf.ejs',
      filename: 'server.conf',
      inject: false,
      chunks: ['sdk'],
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
    new webpack.optimize.DedupePlugin(),
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
    noParse: /\.min\.js$/,
    loaders: [
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../app/components')],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: [
            {loader: 'css', query: {sourceMap: true}},
            'postcss',
            {loader: 'namespace-css', query: '#quiqWebChat'},
            {loader: 'sass', query: {outputStyle: 'compressed'}},
          ],
        }),
      },
      {
        test: /\.s?css$/,
        include: [
          path.resolve(__dirname, '../SDK/src/components'),
          path.resolve(__dirname, '../node_modules/emoji-mart'),
          path.resolve(__dirname, '../node_modules/draft-js-twemoji-plugin'),
          path.resolve(__dirname, '../node_modules/draft-js'),
        ],
        loader: [
          'style',
          {loader: 'css', query: {sourceMap: true}},
          'postcss',
          {loader: 'namespace-css', query: '#quiqWebChat'},
          {loader: 'sass', query: {outputStyle: 'compressed'}},
        ],
      },
      {
        test: /\.(wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: `assets/audio/[name]-[sha1:hash:hex:8]-${uniqueUrlPiece}.[ext]`,
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: `images/[name]-[sha1:hash:hex:8]-${uniqueUrlPiece}.[ext]`,
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: `fonts/[name]-[sha1:hash:hex:8]-${uniqueUrlPiece}.[ext]`,
        },
      },
    ],
  },
});
