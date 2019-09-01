import { redirectTo } from './routerUtils';
import { getCookieValue } from './token';
import { isServer } from './isEnvironment';
import { getUserSelf, getUserTeams } from '../api';

export function entryResolver({ route, ctx: { req, res } }) {
  const needToken = ![
    '/signin',
    '/signup',
    '/share',
    '/invite',
    '/resetting',
    '/message',
    '/secure',
  ].includes(route);

  if (needToken) {
    const token =
      req && req.cookies ? req.cookies.token : getCookieValue('token');

    if (!token) {
      redirectTo(res, '/signin', 302);
    }
  }
}

export async function getUserWithTeam(req) {
  const token = isServer ? req.cookies.token : getCookieValue('token');
  const teamId = isServer ? req.cookies.teamId : getCookieValue('teamId');

  const { data: user } = await getUserSelf(token);
  const { data: teams } = await getUserTeams(token);

  const team = teams.find(({ id }) => id === teamId) || teams[0];

  return {
    user,
    team,
  };
}
