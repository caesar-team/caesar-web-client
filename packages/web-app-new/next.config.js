/** @type {import('next').NextConfig} */
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
const withOffline = require('next-offline');
const withTM = require('next-transpile-modules')([
  '@caesar/assets',
  '@caesar/common',
  '@caesar/containers',
  '@caesar/components',
]);
const withLinaria = require('next-linaria');
const { withEffectorReactAliases } = require("effector-next/tools");

const withEffector = withEffectorReactAliases();

const publicRuntimeConfig = {
  IS_PROD: process.env.NODE_ENV === 'production',
  API_URI: `${process.env.API_URI}`,
  APP_PORT: `${process.env.APP_PORT}`,
  APP_URI: `${process.env.APP_URI}${
    process.env.APP_PORT && process.env.APP_PORT !== '80'
      ? `:${process.env.APP_PORT}`
      : ''
  }`,
  API_BASE_PATH: process.env.API_BASE_PATH || 'api',
  AUTH_ENDPOINT: process.env.AUTH_ENDPOINT || 'connect/google',
  REDIRECT_AUTH_ENDPOINT: process.env.REDIRECT_AUTH_ENDPOINT || 'check_auth',
  MAX_UPLOADING_FILE_SIZE: process.env.MAX_UPLOADING_FILE_SIZE || '256KB',
  TOTAL_MAX_UPLOADING_FILES_SIZES:
    process.env.TOTAL_MAX_UPLOADING_FILES_SIZES || '5MB',
  LENGTH_KEY: process.env.LENGTH_KEY || 2048,
  AUTHORIZATION_ENABLE: process.env.AUTHORIZATION_ENABLE !== 'false',
  APP_TYPE: process.env.APP_TYPE || 'general',
  APP_VERSION: process.env.APP_VERSION,
  DOMAIN_HOSTNAME: process.env.DOMAIN_HOSTNAME,
  LOG_LEVEL:
    process.env.LOG_LEVEL || process.env.NODE_ENV === 'production'
      ? 'error'
      : 'debug',
};

const serverRuntimeConfig = {};

const workboxOptions = {
  swDest: 'static/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /.png|.svg|.jpg$/,
      handler: 'CacheFirst',
    },
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        networkTimeoutSeconds: 15,
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};

module.exports = withPlugins(
  [
    withOffline,
    [
      withLinaria,
      {
        linaria: {
          babelOptions: {
            rootMode: 'upward',
          },
        },
      },
    ],
    withTM,
    withEffector
  ],
  {
    reactStrictMode: true,
    publicRuntimeConfig,
    serverRuntimeConfig,
    workboxOpts: workboxOptions,
  },
);
