import { APP_URI } from '@caesar/common/constants';

export const getAnonymousLink = shared => (shared && shared.link) || null;

export const hideLink = link =>
  `${APP_URI}/${link
    .replace(APP_URI, '')
    .split('')
    .map(() => '*')
    .join('')}`;
