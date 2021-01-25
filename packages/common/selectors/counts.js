import { createSelector } from 'reselect';
import { getItemListKey } from '../utils/item';
import { itemsByListIdsSelector } from './entities/item';
import { teamListIdsSelector } from './entities/list';

export const listsItemsSelector = createSelector(
  teamListIdsSelector,
  state => state,
  (listIds, state) => {
    return itemsByListIdsSelector(state, { listIds });
  },
);

export const teamListsSizesByIdSelector = createSelector(
  teamListIdsSelector,
  listsItemsSelector,
  (ids, items) =>
    ids?.reduce(
      (acc, listId) => ({
        ...acc,
        [listId]:
          items.filter(item => item[getItemListKey(item)] === listId)?.length ||
          0,
      }),
      {},
    ) || {},
);

const listsIdPropSelector = (_, prop) => prop.listsId;
export const listsSizeSelector = createSelector(
  listsIdPropSelector,
  listsItemsSelector,
  (listsIds, items) => {
    const listsArray = listsIds?.map(listId => [
      listId,
      items.filter(item => item.listId === listId)?.length || 0,
    ]);

    return Object.fromEntries(listsArray);
  },
);
