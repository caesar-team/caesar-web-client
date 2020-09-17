import { createSelector } from 'reselect';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { ITEM_TYPE } from '@caesar/common/constants';

export const entitiesSelector = state => state.entities;

export const itemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.item,
);

export const itemsByIdSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.byId,
);

export const itemListSelector = createSelector(
  itemsByIdSelector,
  byId => Object.values(byId) || [],
);

const itemIdPropSelector = (_, props) => props.itemId;

export const itemSelector = createSelector(
  itemsByIdSelector,
  itemIdPropSelector,
  (itemsById, itemId) => itemsById[itemId] || null,
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const itemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  (itemsById, itemIds) => itemIds.map(itemId => itemsById[itemId] || {}),
);

const teamIdPropSelector = (_, prop) => prop.teamId;

export const nonDecryptedSharedItemsSelector = createSelector(
  itemsByIdSelector,
  items => Object.values(items).filter(item => !item?.data && item.isShared),
);

export const nonDecryptedTeamItemsSelector = createSelector(
  itemsByIdSelector,
  teamIdPropSelector,
  (items, teamId) =>
    Object.values(items).filter(
      item => !item?.data && !item.isShared && item.teamId === teamId,
    ),
);

export const nonDecryptedTeamsItemsSelector = createSelector(
  itemsByIdSelector,
  items => Object.values(items).filter(item => !item?.data && !item.isShared),
);

const listsIdPropSelector = (_, prop) => prop.listsId;
export const nonDecryptedListsItemsSelector = createSelector(
  itemsByIdSelector,
  listsIdPropSelector,
  (items, listsId) =>
    Object.values(items).filter(
      item => !item?.data && !item.isShared && listsId.includes(item.listId),
    ),
);

export const nonDecryptedItemsSelector = createSelector(
  itemsByIdSelector,
  items => Object.values(items).filter(item => !item?.data),
);

export const teamItemListSelector = createSelector(
  itemListSelector,
  teamIdPropSelector,
  (itemList, teamId) => itemList.filter(item => item.teamId === teamId),
);

export const itemChildItemsSelector = createSelector(
  itemSelector,
  childItemsByIdSelector,
  (item, childItemsById) =>
    item.invited.map(childItemId => childItemsById[childItemId]),
);

export const itemsChildItemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  childItemsByIdSelector,
  (itemsById, itemIds, childItemsById) => {
    return itemIds.reduce((accumulator, itemId) => {
      return [
        ...accumulator,
        ...itemsById[itemId].invited.map(
          childItemId => childItemsById[childItemId],
        ),
      ];
    }, []);
  },
);

export const visibleItemsSelector = createSelector(
  itemsBatchSelector,
  items => items.filter(({ type }) => type !== ITEM_TYPE.SYSTEM) || [],
);
