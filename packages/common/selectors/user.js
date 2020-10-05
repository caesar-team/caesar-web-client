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
  userDataSelector,
  user => (!user ? ['personal'] : ['personal', ...user?.teamIds]),
);

export const userTeamListSelector = createSelector(
  teamsByIdSelector,
  userTeamIdsSelector,
  (teamsById, userTeamIds) => {
    if (!Object.keys(teamsById).length) return [];

    return userTeamIds.map(teamId => teamsById[teamId]);
  },
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
  userDataSelector,
  data => data.roles.includes(ROLE_ANONYMOUS_USER),
);

export const userIdSelector = createSelector(
  userDataSelector,
  data => data.id,
);

// @Deprecated
export const userDefaultListIdSelector = createSelector(
  userSelector,
  user => user.defaultListId,
);
