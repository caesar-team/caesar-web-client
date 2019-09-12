import { createSelector } from 'reselect';

export const entitiesSelector = state => state.entities;

export const childItemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.childItem,
);

export const childItemsByIdSelector = createSelector(
  childItemEntitySelector,
  childItemEntity => childItemEntity.byId || {},
);

const childItemIdsPropSelector = (_, props) => props.childItemIds;

export const childItemsBatchSelector = createSelector(
  childItemsByIdSelector,
  childItemIdsPropSelector,
  (childItemsById, childItemsIds) =>
    childItemsIds.map(childItemId => childItemsById[childItemId]),
);
