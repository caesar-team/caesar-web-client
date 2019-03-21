import { redirectTo } from './routerUtils';
import { getToken } from './token';

export function entryResolver({ route, ctx: { req, res } }) {
  const needToken = ![
    '/signin',
    '/signup',
    '/share',
    '/invite',
    '/resetting',
  ].includes(route);

  if (needToken) {
    const token = req && req.cookies ? req.cookies.token : getToken();

    if (!token) {
      redirectTo(res, '/signin', 302);
    }
  }
}
