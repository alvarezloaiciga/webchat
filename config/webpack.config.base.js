// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.join(__dirname, '../config/scripts'),
      path.join(__dirname, '../app'),
      path.join(__dirname, '../app/assets'),
      path.join(__dirname, '../app/components'),
      path.join(__dirname, '../app/styles'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',  // fetch API
    }),
    // We are purposely not using CommonChunk since we need to output a single .js file.
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: 'js/common.js',
    //   minChunks: Infinity,
    // }),
  ],
  module: {
    loaders: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(core-ui)\/).*/,
        loader: 'babel',
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]',
        },
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]',
        },
      },
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  postcss () {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ];
  },
};
