const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

require('babel-core/register');
require('babel-polyfill');

const BUILD_DIR = '../build';
const PAGES_PATH = './extension/pages';

module.exports = {
  mode: 'development',
  entry: {
    background: `${PAGES_PATH}/background`,
    popup: `${PAGES_PATH}/popup`,
    // index: ['babel-polyfill', `${PAGES_PATH}/content`],
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
    new ChromeExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        background: 'background',
      },
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyPlugin([
      {
        from: 'extension',
        to: path.resolve('build'),
        ignore: [
          'pages/**/*',
          'webpack.*.config.js',
          'popup.html',
          '.babelrc',
          'containers/**/*',
          'components/**/*',
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
