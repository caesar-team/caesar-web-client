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
const path = require('path');
const APP_URI = process.env.APP_URI || 'http://localhost';
const fastify = require('fastify')({
  pluginTimeout: 10000 * 2,
  logger: { level: 'error' },
});
const fastifyStatic = require('fastify-static');
const Next = require('next');

const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

fastify.register((fastify, opts, next) => {
  const app = Next({ dev: IS_DEV });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(() => {
      if (IS_DEV) {
        fastify.get('/_next/*', (req, reply) => {
          return handle(req.req, reply.res).then(() => {
            reply.sent = true;
          });
        });
      }

      fastify.get('/favicon.ico', (req, reply) => {
        reply.sendFile('images/favicon/favicon.ico'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
      });
      fastify.get('/favicon-locked.ico', (req, reply) => {
        reply.sendFile('images/favicon/favicon-locked.ico'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
      });

      // fastify.get('/a', (req, reply) => {
      //   return app.render(req.req, reply.res, '/a', req.query).then(() => {
      //     reply.sent = true;
      //   });
      // });
      //
      // fastify.get('/b', (req, reply) => {
      //   return app.render(req.req, reply.res, '/b', req.query).then(() => {
      //     reply.sent = true;
      //   });
      // });

      fastify.all('/*', (req, reply) => {
        return handle(req.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      fastify.setNotFoundHandler((request, reply) => {
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
fastify.listen(APP_PORT, err => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`> Ready on http://localhost:${APP_PORT}`);
});
