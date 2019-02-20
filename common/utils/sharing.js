import { APP_URL } from 'common/constants';

export const generateSharingUrl = encryption =>
  `${APP_URL}/share/${encryption}`;
