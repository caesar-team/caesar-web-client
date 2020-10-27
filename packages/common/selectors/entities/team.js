import { createSelector } from 'reselect';
import { TEAM_ROLES, TEAM_TYPE } from '@caesar/common/constants';
import { sortByName } from '@caesar/common/utils/utils';

export const entitiesSelector = state => state.entities;

export const teamEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.team,
);

export const isLoadingTeamsSelector = createSelector(
  teamEntitySelector,
  teamEntity => teamEntity.isLoading,
);

export const teamsByIdSelector = createSelector(
  teamEntitySelector,
  teamEntity => teamEntity.byId,
);

export const teamListSelector = createSelector(
  teamsByIdSelector,
  byId => Object.values(byId) || [],
);

export const teamSortedListSelector = createSelector(
  teamListSelector,
  teams => {
    const defaultTeam = teams.find(team => team.type === TEAM_TYPE.DEFAULT);
    const otherTeams = teams
      .filter(
        team => ![TEAM_TYPE.DEFAULT, TEAM_TYPE.PERSONAL].includes(team.type),
      )
      .sort((a, b) => sortByName(a.title, b.title));

    return defaultTeam ? [defaultTeam, ...otherTeams] : otherTeams;
  },
);

export const teamIdPropSelector = (_, props) => props.teamId;

export const teamSelector = createSelector(
  teamsByIdSelector,
  teamIdPropSelector,
  (byId, teamId) => byId[teamId],
);

const teamIdsPropSelector = (_, props) => props.teamIds;

export const teamsBatchSelector = createSelector(
  teamsByIdSelector,
  teamIdsPropSelector,
  (teamsById, teamIds) => teamIds.map(teamId => teamsById[teamId]),
);

export const teamAdminUsersSelector = createSelector(
  teamSelector,
  team =>
    team.users
      ?.filter(user => user.role === TEAM_ROLES.ROLE_ADMIN)
      .map(user => user.id) || [],
);
