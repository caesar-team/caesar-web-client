import { createSelector } from 'reselect';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { TEAM_TYPE, USER_ROLE_ADMIN } from '@caesar/common/constants';
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

const teamIdPropSelector = (_, props) => props.teamId;

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

// @Deprecated
export const teamMembersSelector = createSelector(
  teamSelector,
  membersByIdSelector,
  (team, membersById) =>
    team?.users?.map(({ userId }) => membersById[userId]) ?? [],
);

export const teamsMembersSelector = createSelector(
  teamsBatchSelector,
  membersByIdSelector,
  (teams, membersById) => {
    return teams.reduce(
      (accumulator, team) =>
        team
          ? [
              ...accumulator,
              ...team.users.map(({ id }) => ({
                ...membersById[id],
                teamId: team.id,
              })),
            ]
          : accumulator,
      [],
    );
  },
);

export const teamAdminUsersSelector = createSelector(
  teamSelector,
  team =>
    team.users
      ?.filter(user => user.role === USER_ROLE_ADMIN)
      .map(user => user.id) || [],
);
