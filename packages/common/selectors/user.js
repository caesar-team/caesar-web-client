import { createSelector } from 'reselect';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { ROLE_ANONYMOUS_USER } from '@caesar/common/constants';

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

export const caslUserDataSelector = createSelector(
  userDataSelector,
  userTeamIdsSelector,
  (userData, userTeamIds) =>
    userData
      ? {
          ...userData,
          teamIds: userTeamIds,
        }
      : null,
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

export const isUserAnonymousSelector = createSelector(
  userSelector,
  user => user.roles.includes(ROLE_ANONYMOUS_USER),
);

export const userIdSelector = createSelector(
  userSelector,
  user => user.id,
);