import { createSelector } from 'reselect';
import { TEAM_ROLES } from '@caesar/common/constants';
import { sortTeams } from '@caesar/common/utils/sort';

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
  sortTeams,
);

export const teamIdPropSelector = (_, props) => props.teamId;

export const teamSelector = createSelector(
  teamsByIdSelector,
  teamIdPropSelector,
  (byId, teamId) => byId[teamId] || {},
);

export const teamIdsPropSelector = (_, props) => props.teamIds;

export const teamsBatchSelector = createSelector(
  teamsByIdSelector,
  teamIdsPropSelector,
  (teamsById, teamIds) => teamIds.map(teamId => teamsById[teamId]),
);

export const teamAdminUsersSelector = createSelector(
  teamSelector,
  team =>
    team.members
      ?.filter(member => member.role === TEAM_ROLES.ROLE_ADMIN)
      .map(member => member.id) || [],
);

export const teamsMembersSelector = createSelector(
  teamsBatchSelector,
  teams =>
    teams?.reduce(
      (accumulator, team) => [...accumulator, ...(team.members || [])],
      [],
    ) || [],
);
