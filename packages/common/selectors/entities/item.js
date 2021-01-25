import { createSelector } from 'reselect';
import { currentTeamTrashListSelector } from './list';
import { getItemListKey, isGeneralItem } from '../../utils/item';
import { LIST_TYPE } from '../../constants';

export const entitiesSelector = state => state.entities;

export const itemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.item,
);

export const itemsByIdSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.byId,
);

export const itemIdsSelector = createSelector(
  itemsByIdSelector,
  itemsById => Object.keys(itemsById),
);

export const itemArraySelector = createSelector(
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
  (itemsById, itemIds = []) => itemIds.map(itemId => itemsById[itemId] || []),
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

export const teamItemsSelector = createSelector(
  itemArraySelector,
  teamIdPropSelector,
  (itemList, teamId) => itemList.filter(item => item.teamId === teamId) || [],
);

export const teamItemIdsSelector = createSelector(
  teamItemsSelector,
  teamItems => teamItems.map(({ id }) => id),
);

export const generalItemsSelector = createSelector(
  itemsBatchSelector,
  items => items.filter(isGeneralItem) || [],
);

export const itemsByListIdSelector = createSelector(
  itemArraySelector,
  currentTeamTrashListSelector,
  teamIdPropSelector,
  listIdPropSelector,
  (itemList, currentTeamTrashList, teamId, listId) => {
    const listKey = getItemListKey({ teamId });

    if (listId === LIST_TYPE.FAVORITES) {
      return itemList.filter(
        item =>
          item.favorite &&
          item.teamId === teamId &&
          item[listKey] !== currentTeamTrashList.id,
      );
    }

    return itemList.filter(item => item[listKey] === listId);
  },
);

const listIdsPropSelector = (_, props) => props.listIds;
export const itemsByListIdsSelector = createSelector(
  itemArraySelector,
  listIdsPropSelector,
  (itemList, listIds) =>
    itemList?.filter(
      item =>
        listIds?.includes(item[getItemListKey(item)]) && isGeneralItem(item),
    ) || [],
);

export const importProgressPercentSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.importProgressPercent,
);
