import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const childItemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.childItem,
);

export const childItemsByIdSelector = createSelector(
  childItemEntitySelector,
  childItemEntity => childItemEntity.byId,
);

export const childItemsSelector = createSelector(
  childItemEntitySelector,
  childItemsById => Object.values(childItemsById) || [],
);
