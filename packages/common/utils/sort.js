import { TEAM_TYPE } from '@caesar/common/constants';
import { sortByDate } from './dateUtils';
import { sortByName } from './utils';

export { sortByDate } from './dateUtils';
export { sortByName } from './utils';

export const sortItems = (a, b) =>
  sortByDate(a.lastUpdated, b.lastUpdated, 'DESC') || sortByName(a.id, b.id);

export const sortTeams = teams => {
  const defaultTeam = teams.find(team => team.type === TEAM_TYPE.DEFAULT);
  const otherTeams = teams
    .filter(
      team => ![TEAM_TYPE.DEFAULT, TEAM_TYPE.PERSONAL].includes(team.type),
    )
    .sort((a, b) => sortByName(a.title, b.title));

  return defaultTeam ? [defaultTeam, ...otherTeams] : otherTeams;
};
