module.exports = {
  apps: [
    {
      name: 'caesarapp-web',
      script: 'yarn start',
      args: 'prod',
      env: {
        NODE_ENV: 'production',
        API_PROTOCOL: 'http',
        API_HOST: 'api.dev.caesarapp.io',
        APP_PROTOCOL: 'http',
        APP_HOST: 'dev.caesarapp.io',
        APP_PORT: '3000',
        REDIRECT_AUTH_ENDPOINT: 'check_auth',
      },
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      user: 'deploy',
      // SSH host
      host: ['dev.caesarapp.io'],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: 'StrictHostKeyChecking=no',
      // GIT remote/branch
      ref: 'origin/master',
      // GIT remote
      repo: 'git@bitbucket.org:4xxi/caesarapp-web-app.git',
      // path in the server
      path: '/var/www/dev.caesarapp.io/app',
      // Pre-setup command or path to a script on your local machine
      // 'pre-setup': '',
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': '/var/www/dev.caesarapp.io/app/setup.sh',
      // pre-deploy action
      // 'pre-deploy-local': "echo 'This is a local executed command'",
      // post-deploy action
      'post-deploy': 'yarn install && yarn build',
    },
  },
};
