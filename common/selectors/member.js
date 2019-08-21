import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const memberEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.member,
);

export const membersByIdSelector = createSelector(
  memberEntitySelector,
  memberEntity => memberEntity.byId,
);

export const memberListSelector = createSelector(
  membersByIdSelector,
  byId => Object.values(byId) || [],
);
