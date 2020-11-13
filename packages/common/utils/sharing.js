import { APP_URI } from '@caesar/common/constants';

export const generateSharingUrl = encryption =>
  `${APP_URI}/share/${encryption}`;

export const generateInviteUrl = encryption =>
  `${APP_URI}/invite/${encryption}`;
