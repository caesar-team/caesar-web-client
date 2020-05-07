import { createSelector } from 'reselect';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';

export const entitiesSelector = state => state.entities;

export const teamEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.team,
);

export const isLoadingSelector = createSelector(
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

export const teamMembersSelector = createSelector(
  teamSelector,
  membersByIdSelector,
  (team, membersById) => team.users.map(({ userId }) => membersById[userId]),
);

export const teamsMembersSelector = createSelector(
  teamsBatchSelector,
  membersByIdSelector,
  (teams, membersById) => {
    return teams.reduce(
      (accumulator, team) => [
        ...accumulator,
        ...team.users.map(({ id }) => ({
          ...membersById[id],
          teamId: team.id,
        })),
      ],
      [],
    );
  },
);
