import { createSelector } from 'reselect';
import { DOMAIN_ROLES } from '../../constants';

export const entitiesSelector = state => state.entities;

export const userEntitySelector = createSelector(
  entitiesSelector,
  entities => entities?.user || {},
);

export const usersByIdSelector = createSelector(
  userEntitySelector,
  userEntity => userEntity.byId || {},
);

export const userListSelector = createSelector(
  usersByIdSelector,
  byId => Object.values(byId) || [],
);

export const userIdPropSelector = (_, props) => props.userId;

export const userSelector = createSelector(
  usersByIdSelector,
  userIdPropSelector,
  (usersById, userId) => usersById[userId] || null,
);

const userIdsPropSelector = (_, props) => props.userIds;

export const usersBatchSelector = createSelector(
  usersByIdSelector,
  userIdsPropSelector,
  (usersById, userIds) =>
    userIds.map(userId => usersById[userId] || null).filter(u => u !== null),
);

export const userAdminsSelector = createSelector(
  userListSelector,
  usersList =>
    usersList.filter(({ domainRoles }) =>
      domainRoles?.includes(DOMAIN_ROLES.ROLE_ADMIN),
    ),
);
