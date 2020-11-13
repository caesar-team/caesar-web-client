import { createSelector } from 'reselect';
import { itemsByListIdsSelector } from './entities/item';
import { teamListIdsSelector } from './entities/list';

export const listsItemsSelector = createSelector(
  teamListIdsSelector,
  state => state,
  (listsId, state) => {
    return itemsByListIdsSelector(state, { listIds: listsId });
  },
);

export const teamListsSizesByIdSelector = createSelector(
  teamListIdsSelector,
  listsItemsSelector,
  (ids, items) =>
    ids?.reduce(
      (acc, listId) => ({
        ...acc,
        [listId]: items.filter(item => item.listId === listId)?.length || 0,
      }),
      {},
    ),
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
