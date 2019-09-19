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

export const childItemListSelector = createSelector(
  childItemsByIdSelector,
  byId => Object.values(byId) || [],
);

const childItemIdsPropSelector = (_, props) => props.childItemIds;

export const childItemsBatchSelector = createSelector(
  childItemsByIdSelector,
  childItemIdsPropSelector,
  (childItemsById, childItemsIds) =>
    childItemsIds.map(childItemId => childItemsById[childItemId]),
);

const filterFn = fields => childItem =>
  Object.keys(fields).every(
    fieldName => childItem[fieldName] === fields[fieldName],
  );

export const createChildItemsFilterSelector = fields =>
  createSelector(
    childItemListSelector,
    childItems => childItems.filter(filterFn(fields)),
  );
