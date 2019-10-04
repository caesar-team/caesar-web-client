import { createSelector } from 'reselect';
import { teamsByIdSelector } from 'common/selectors/entities/team';

export const userSelector = state => state.user;

export const isLoadingSelector = createSelector(
  userSelector,
  user => user.isLoading,
);

export const keyPairSelector = createSelector(
  userSelector,
  user => user.keyPair,
);

export const masterPasswordSelector = createSelector(
  userSelector,
  user => user.masterPassword,
);

export const userDataSelector = createSelector(
  userSelector,
  user => user.data,
);

export const userTeamIdsSelector = createSelector(
  userSelector,
  user => user.teamIds,
);

export const userTeamListSelector = createSelector(
  teamsByIdSelector,
  userTeamIdsSelector,
  (teamsById, userTeamIds) => userTeamIds.map(teamId => teamsById[teamId]),
);

export const currentTeamIdSelector = createSelector(
  userSelector,
  user => user.currentTeamId,
);

export const currentTeamSelector = createSelector(
  currentTeamIdSelector,
  teamsByIdSelector,
  (currentTeamId, teamsById) => teamsById[currentTeamId],
);
