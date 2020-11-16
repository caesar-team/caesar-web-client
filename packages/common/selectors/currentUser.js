import { createSelector } from 'reselect';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { DOMAIN_ROLES, TEAM_TYPE } from '@caesar/common/constants';

export const currentUserSelector = state => {
  return state.currentUser;
};

export const isLoadingSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser.isLoading,
);

export const getLastUpdatedSelector = createSelector(
  currentUserSelector,
  // user => user.lastUpdated,
  () => {
    return null;
  },
);

export const keyPairSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser.keyPair,
);

export const masterPasswordSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser.masterPassword,
);

export const currentUserDataSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser.data,
);

export const currentUserTeamIdsSelector = createSelector(
  currentUserDataSelector,
  currentUser => currentUser?.teamIds,
);

export const currentUserVaultIdsSelector = createSelector(
  currentUserDataSelector,
  currentUser =>
    currentUser
      ? [TEAM_TYPE.PERSONAL, ...currentUser?.teamIds]
      : [TEAM_TYPE.PERSONAL],
);

export const currentUserTeamListSelector = createSelector(
  teamsByIdSelector,
  currentUserTeamIdsSelector,
  (teamsById, currentUserTeamIds) => {
    if (!Object.keys(teamsById).length) return [];

    return currentUserTeamIds.map(teamId => teamsById[teamId]);
  },
);

export const currentUserVaultListSelector = createSelector(
  teamsByIdSelector,
  currentUserVaultIdsSelector,
  (teamsById, currentUserVaultIds) => {
    if (!Object.keys(teamsById).length) return [];

    return currentUserVaultIds.map(vaultId => teamsById[vaultId]);
  },
);

// TODO: Move to workflow
export const currentTeamIdSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser.currentTeamId || TEAM_TYPE.PERSONAL,
);

export const currentTeamSelector = createSelector(
  currentTeamIdSelector,
  teamsByIdSelector,
  (currentTeamId, teamsById) => {
    return teamsById[currentTeamId];
  },
);

export const isUserAnonymousSelector = createSelector(
  currentUserDataSelector,
  data => data.domainRoles?.includes(DOMAIN_ROLES.ROLE_ANONYMOUS_USER),
);

export const currentUserIdSelector = createSelector(
  currentUserDataSelector,
  data => data.id,
);

export const isUserDomainAdminSelector = createSelector(
  currentUserDataSelector,
  data => data.domainRoles?.includes(DOMAIN_ROLES.ROLE_ADMIN),
);

export const isUserDomainManagerSelector = createSelector(
  currentUserDataSelector,
  data => data.domainRoles?.includes(DOMAIN_ROLES.ROLE_MANAGER),
);

export const isUserDomainAdminOrManagerSelector = createSelector(
  isUserDomainAdminSelector,
  isUserDomainManagerSelector,
  (isAdmin, isManager) => isAdmin || isManager,
);
