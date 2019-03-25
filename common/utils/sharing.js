import { APP_URI } from 'common/constants';

export const generateSharingUrl = (shareId, encryption) =>
  `${APP_URI}/share/${shareId}/${encryption}`;

export const generateInviteUrl = encryption =>
  `${APP_URI}/invite/${encryption}`;
