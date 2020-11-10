import { createSelector } from 'reselect';
import { itemsByListIdsSelector } from './entities/item';
import { listsIdTeamSelector } from './entities/list';

export const teamItemsSelector = createSelector(
  listsIdTeamSelector,
  state => state,
  (listsId, state) => {
    return itemsByListIdsSelector(state, { listIds: listsId });
  },
);

export const teamListsSizesByIdSelector = createSelector(
  listsIdTeamSelector,
  teamItemsSelector,
  (ids, items) => {
    const listsArray = ids?.map(listId => [
      listId,
      items.filter(item => item.listId === listId)?.length || 0,
    ]);

    return Object.fromEntries(listsArray);
  },
);
