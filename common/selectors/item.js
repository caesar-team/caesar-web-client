import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const itemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.item,
);

export const itemsByIdSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.byId,
);

export const itemsSelector = createSelector(
  itemsByIdSelector,
  itemsById => Object.values(itemsById) || [],
);
