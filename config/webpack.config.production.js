const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.base');

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
};

module.exports = merge(config, {
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    webchat: 'production',
    // common: ['react', 'react-dom' ],
  },
  plugins: [
    // new CopyWebpackPlugin([
    //   {
    //     from: 'app/assets/images',
    //     to: 'images',
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
      sourceMap: false,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new ExtractTextPlugin({
      filename: 'css/app.css',
      allChunks: true,
    }),
  ],
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../app/components'),
        ],
        loader: [
          'style-loader',
          { loader: 'css', query: { sourceMap: true } },
          'postcss',
          { loader: 'sass', query: { outputStyle: 'compressed' } },
        ],
      },
    ],
  },
});
