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
const withCss = require('@zeit/next-css');

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {};
}

module.exports = withPlugins([withCss], {
  publicRuntimeConfig: { // Will be available on both server and client
    TEST: true,
    NODE_ENV: process.env.NODE_ENV,
    IS_PROD: process.env.NODE_ENV === 'production',
    API_URL: `${process.env.API_PROTOCOL}://${process.env.API_HOST}`,
    APP_URL: `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}${
      process.env.NODE_ENV === 'development' ? `:${process.env.APP_PORT}` : ''
      }`,
    API_BASE_PATH: process.env.API_BASE_PATH,
    AUTH_ENDPOINT: process.env.AUTH_ENDPOINT,
    REDIRECT_AUTH_ENDPOINT: process.env.REDIRECT_AUTH_ENDPOINT,
    MAX_UPLOADING_FILE_SIZE: process.env.MAX_UPLOADING_FILE_SIZE,
  },
  webpack: (config, { dev }) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
    ];

    config.module.rules.push({
      test: /\.svg(\?v=\d\.\d\.\d)?$/,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true,
          },
        },
      ],
    }, {
        test: /\.(less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.less$/,
        use: [
          'babel-loader',
          'raw-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      });

    return config;
  },
});
