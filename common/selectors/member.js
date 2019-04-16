import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const memberSelector = createSelector(
  entitiesSelector,
  entities => entities.member,
);

export const byIdSelector = createSelector(
  memberSelector,
  member => member.byId,
);

export const memberListSelector = createSelector(
  byIdSelector,
  byId => Object.values(byId) || [],
);
