import Router from 'next/router';
import { isServer } from './isEnvironment';
import { getToken } from './token';

export function entryResolver({ router, ctx }) {
  const needToken = isServer && !['/auth', '/share'].includes(router.route);

  if (needToken) {
    const { req, res } = ctx;
    const token = req.cookies ? req.cookies.token : getToken();

    if (!token) {
      if (isServer) {
        res.writeHead(302, {
          Location: '/auth',
        });
        res.end();
      } else {
        Router.push('/auth');
      }
    }
  }
}
