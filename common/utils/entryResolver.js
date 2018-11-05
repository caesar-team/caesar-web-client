import Router from 'next/router';
import { isServer } from './isEnvironment';
import { getToken } from './token';

export function entryResolver({ router, ctx }) {
  if (isServer && router.route !== '/auth') {
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
