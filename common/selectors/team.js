import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const teamEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.team,
);

export const teamsByIdSelector = createSelector(
  teamEntitySelector,
  teamEntity => teamEntity.byId,
);

export const teamListSelector = createSelector(
  teamsByIdSelector,
  byId => Object.values(byId) || [],
);
