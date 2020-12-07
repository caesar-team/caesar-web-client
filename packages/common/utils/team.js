import { TEAM_TYPE, TEAM_TEXT_TYPE } from '@caesar/common/constants';
import { getDomainName } from './getDomainName';

export const getTeamTitle = ({ id, type, title } = {}) => {
  switch (true) {
    case type === TEAM_TYPE.DEFAULT ||
      title?.toLowerCase() === TEAM_TYPE.DEFAULT:
      return getDomainName(window.location.hostname);

    case id === TEAM_TYPE.PERSONAL:
      return TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];

    default:
      return title;
  }
};
