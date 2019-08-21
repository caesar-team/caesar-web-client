import { createSelector } from 'reselect';
import { itemsByIdSelector } from './item';

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

const childItemIdsPropSelector = (_, props) => props.childItemIds;

export const childItemsBatchSelector = createSelector(
  childItemsByIdSelector,
  childItemIdsPropSelector,
  (childItemsById, childItemsIds) =>
    childItemsIds.map(childItemId => childItemsById[childItemId]),
);
