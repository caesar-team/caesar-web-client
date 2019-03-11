import { APP_URL } from 'common/constants';

export const generateSharingUrl = (shareId, encryption) =>
  `${APP_URL}/share/${shareId}/${encryption}`;
