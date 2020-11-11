import { createSelector } from 'reselect';
import { itemsByListIdsSelector } from './entities/item';
import { listsIdTeamSelector } from './entities/list';

export const listsItemsSelector = createSelector(
  listsIdTeamSelector,
  state => state,
  (listsId, state) => {
    return itemsByListIdsSelector(state, { listIds: listsId });
  },
);

export const teamListsSizesByIdSelector = createSelector(
  listsIdTeamSelector,
  listsItemsSelector,
  (ids, items) => {
    const listsArray = ids?.map(listId => [
      listId,
      items.filter(item => item.listId === listId)?.length || 0,
    ]);

    return Object.fromEntries(listsArray);
  },
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
