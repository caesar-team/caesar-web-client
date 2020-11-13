/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const exit = require('process');
const path = require('path');
const fastifyStatic = require('fastify-static');
const Next = require('next');

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

if (!process.env.API_URI) {
  console.error(`Fatal: Can't find API_URI env in process.env;`);
  console.error(`Check is ${envFile} exists;`);

  return exit(1);
}

const ENABLE_SERVER_LOGGER = process.env.ENABLE_SERVER_LOGGER || false;
const LOG_LEVEL =
  process.env.LOG_LEVEL || process.env.NODE_ENV === 'production'
    ? 'error'
    : 'debug';
const fastify = require('fastify')({
  pluginTimeout: 10000 * 3,
  logger: ENABLE_SERVER_LOGGER ? { level: LOG_LEVEL } : false,
});

const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

fastify.register((fastifyApp, opts, next) => {
  const app = Next({ dev: IS_DEV });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(() => {
      if (IS_DEV) {
        fastifyApp.get('/_next/*', (req, reply) => {
          return handle(req.req, reply.res).then(() => {
            reply.sent = true;
          });
        });
      }

      fastifyApp.get('/favicon.ico', (req, reply) => {
        reply.sendFile('images/favicon/favicon.ico'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
      });
      fastifyApp.get('/favicon-locked.ico', (req, reply) => {
        reply.sendFile('images/favicon/favicon-locked.ico'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
      });

      fastifyApp.all('/*', (req, reply) => {
        return handle(req.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      fastifyApp.setNotFoundHandler((request, reply) => {
        return app.render404(request.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      next();
    })
    .catch(err => next(err));
});
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});
fastify.listen(APP_PORT, '::', (err, address) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`> Ready on ${address}`);
});
