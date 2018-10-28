/* eslint-disable */

const path = require('path');
const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
const DotenvPlugin = require('dotenv-webpack');

const getEnvFile = dev => (dev ? 'development' : 'production');

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {};
}

module.exports = withPlugins([withCss], {
  webpack: (config, { dev }) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
      new DotenvPlugin({
        path: path.join(__dirname, `.env.${getEnvFile(dev)}`),
        systemvars: true,
      }),
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
