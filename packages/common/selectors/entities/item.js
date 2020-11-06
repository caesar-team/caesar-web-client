import { createSelector } from 'reselect';
import { isGeneralItem } from '../../utils/item';

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
  (itemsById, itemIds = []) => itemIds.map(itemId => itemsById[itemId] || {}),
);

export const generalItemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  (itemsById, itemIds = []) => {
    return itemIds.map(itemId => itemsById[itemId] || {}).filter(isGeneralItem);
  },
);

const teamIdPropSelector = (_, prop) => prop.teamId;

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
  items => Object.values(items).filter(item => !item?.data && item.teamId),
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

export const nonDecryptedSharedItemsSelector = createSelector(
  nonDecryptedItemsSelector,
  teamIdPropSelector,
  (items, teamId) => {
    return Object.values(items).filter(
      item => !item?.data && item.isShared && item.teamId === teamId,
    );
  },
);

const listIdPropSelector = (_, prop) => prop.listId;
export const itemsGeneralListSelector = createSelector(
  itemsByIdSelector,
  listIdPropSelector,
  (items, listId) => {
    return Object.values(items).filter(
      item => listId === item.listId && isGeneralItem(item),
    );
  },
);

export const teamItemListSelector = createSelector(
  itemListSelector,
  teamIdPropSelector,
  (itemList, teamId) => itemList.filter(item => item.teamId === teamId),
);

export const generalItemsSelector = createSelector(
  itemsBatchSelector,
  items => items.filter(isGeneralItem) || [],
);
