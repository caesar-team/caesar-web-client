const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

require('babel-core/register');
require('babel-polyfill');

const PAGES_PATH = './extension/pages';

module.exports = {
  mode: 'production',
  entry: {
    background: `${PAGES_PATH}/background`,
    popup: `${PAGES_PATH}/popup`,
  },
  output: {
    path: path.resolve('build/pages'),
    filename: '[name].js',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$/,
        use: 'file-loader?name=[name].[ext]?[hash]',
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'svg-sprite-loader' },
          'svg-transform-loader',
          'svgo-loader',
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyPlugin([
      {
        from: 'extension',
        to: path.resolve('build'),
        ignore: [
          './extension/pages/**/*',
          './extension/webpack.*.config.js',
          './extension/popup.html',
          './extension/.babelrc',
        ],
      },
    ]),
    new HtmlPlugin({
      filename: `./popup.html`,
      chunks: ['popup'],
      template: 'extension/popup.html',
      inject: 'body',
    }),
  ],
};
