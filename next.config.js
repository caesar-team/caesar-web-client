/* eslint-disable */
const envFile = `.env.${
  process.env.NODE_ENV !== 'production' ? 'development' : 'production'
}`;

if (require('fs').existsSync(envFile)) {
  require('dotenv').config({
    path: `.env.${
      process.env.NODE_ENV !== 'production' ? 'development' : 'production'
    }`,
  });
}

const withPlugins = require('next-compose-plugins');
const withWorkers = require('@zeit/next-workers');
const withFonts = require('next-fonts');
const withOptimizedImages = require('next-optimized-images');
const withCSS = require('@zeit/next-css');

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {};
}
const publicRuntimeConfig = {
  IS_PROD: process.env.NODE_ENV === 'production',
  API_URI: `${process.env.API_URI}`,
  APP_URI: `${process.env.APP_URI}${
    process.env.NODE_ENV === 'development'
      ? `:${process.env.APP_PORT || '3000'}`
      : ''
  }`,
  API_BASE_PATH: process.env.API_BASE_PATH || 'api',
  AUTH_ENDPOINT: process.env.AUTH_ENDPOINT || 'connect/google',
  REDIRECT_AUTH_ENDPOINT: process.env.REDIRECT_AUTH_ENDPOINT || 'check_auth',
  MAX_UPLOADING_FILE_SIZE: process.env.MAX_UPLOADING_FILE_SIZE || '256KB',
  TOTAL_MAX_UPLOADING_FILES_SIZES: process.env.TOTAL_MAX_UPLOADING_FILES_SIZES || '5M',
  LENGTH_KEY: process.env.LENGTH_KEY || 512,
};

module.exports = withPlugins(
  [withWorkers, withFonts, withOptimizedImages, withCSS],
  {
    publicRuntimeConfig,
    webpack: (config, { dev }) => {
      config.output.globalObject = 'this';

      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'babel-loader',
      });

      return config;
    },
  },
);
