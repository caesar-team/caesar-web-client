import { TEAM_TYPE } from '@caesar/common/constants';
import { getDomainName } from './getDomainName';

export const getTeamTitle = ({ type, title } = {}) =>
  type === TEAM_TYPE.DEFAULT || title?.toLowerCase() === TEAM_TYPE.DEFAULT
    ? getDomainName(window.location.hostname)
    : title;
