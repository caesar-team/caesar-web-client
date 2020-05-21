import { ROUTES } from '@caesar/common/constants';
import { redirectTo } from './routerUtils';
import { getCookieValue } from './token';
import { UNLOCKED_ROUTES } from '../constants';

export function entryResolver({ route, ctx: { req, res } }) {
  const needToken = !UNLOCKED_ROUTES.includes(route);

  if (needToken) {
    const token =
      req && req.cookies ? req.cookies.token : getCookieValue('token');

    if (!token) {
      redirectTo(res, ROUTES.SIGN_IN, 302);
    }
  }
}
