import { createSelector } from 'reselect';
import {
  INBOX_TYPE,
  TRASH_TYPE,
  FAVORITES_TYPE,
  LIST_TYPE,
} from 'common/constants';

export const entitiesSelector = state => state.entities;

export const nodeSelector = createSelector(
  entitiesSelector,
  entities => entities.node,
);

export const isLoadingSelector = createSelector(
  nodeSelector,
  node => node.isLoading,
);

export const listsByIdSelector = createSelector(
  nodeSelector,
  node => node.listsById,
);

export const itemsByIdSelector = createSelector(
  nodeSelector,
  node => node.itemsById,
);

export const workInProgressItemSelector = createSelector(
  nodeSelector,
  node => node.workInProgressItem,
);

export const workInProgressListIdSelector = createSelector(
  nodeSelector,
  node => node.workInProgressListId,
);

export const workInProgressListSelector = createSelector(
  listsByIdSelector,
  workInProgressListIdSelector,
  (listsById, workInProgressListId) => listsById[workInProgressListId],
);

export const listsSelector = createSelector(
  nodeSelector,
  node => Object.values(node.listsById) || [],
);

export const itemsSelector = createSelector(
  nodeSelector,
  node => Object.values(node.itemsById) || [],
);

export const favoriteItemsSelector = createSelector(
  itemsSelector,
  items => items.filter(({ favorite }) => !!favorite),
);

export const selectableListsSelector = createSelector(
  listsSelector,
  lists => [
    ...lists.filter(list => list.type === INBOX_TYPE),
    ...lists.filter(list => list.type === TRASH_TYPE),
    ...lists.filter(list => list.type === LIST_TYPE && list.parentId),
  ],
);

const inboxSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === INBOX_TYPE) || {},
);

const listSelector = createSelector(
  listsSelector,
  lists =>
    lists.filter(({ type, parentId }) => type === LIST_TYPE && parentId) || [],
);

const trashSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === TRASH_TYPE) || {},
);

export const favoritesSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === FAVORITES_TYPE) || {},
);

export const listsByTypeSelector = createSelector(
  inboxSelector,
  listSelector,
  favoritesSelector,
  trashSelector,
  (inbox, list, favorites, trash) => ({ inbox, list, favorites, trash }),
);

export const visibleListItemsSelector = createSelector(
  listsByIdSelector,
  itemsByIdSelector,
  workInProgressListIdSelector,
  (listsById, itemsById, workInProgressListId) =>
    listsById && workInProgressListId
      ? listsById[workInProgressListId].children.reduce(
          (accumulator, item) =>
            itemsById[item.id]
              ? accumulator.concat(itemsById[item.id])
              : accumulator,
          [],
        )
      : [],
);
