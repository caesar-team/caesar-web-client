import { redirectTo } from './routerUtils';
import { getToken } from './token';

export function entryResolver({ route, ctx: { req, res } }) {
  const needToken = !['/auth', '/share'].includes(route);

  if (needToken) {
    const token = req && req.cookies ? req.cookies.token : getToken();

    if (!token) {
      redirectTo(res, '/auth', 302);
    }
  }
}
