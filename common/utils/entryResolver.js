import Router from 'next/router';
import { isServer } from './isEnvironment';

export function entryResolver({ router, ctx }) {
  if (isServer && router.route !== '/auth') {
    const { req, res } = ctx;
    const { token } = req.cookies;

    if (!token) {
      if (res) {
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
