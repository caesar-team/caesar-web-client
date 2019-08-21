import { createSelector } from 'reselect';
import {
  listsByIdSelector,
  favoriteListSelector,
  extendedSortedCustomizableListsSelector,
} from './list';
import { itemsByIdSelector } from './item';
import { childItemsByIdSelector } from './childItem';

export const workflowSelector = state => state.workflow;

export const isLoadingSelector = createSelector(
  workflowSelector,
  workflow => workflow.isLoading,
);

export const isErrorSelector = createSelector(
  workflowSelector,
  workflow => workflow.isError,
);

export const workInProgressItemSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressItem,
);

export const workInProgressItemChildItemsSelector = createSelector(
  workInProgressItemSelector,
  childItemsByIdSelector,
  (workInProgressItem, childItemsById) =>
    workInProgressItem && Object.values(childItemsById).length
      ? workInProgressItem.invited.map(id => childItemsById[id])
      : [],
);

export const workInProgressListIdSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressListId,
);

export const workInProgressItemIdsSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressItemIds,
);

export const workInProgressListSelector = createSelector(
  listsByIdSelector,
  workInProgressListIdSelector,
  favoriteListSelector,
  (listsById, workInProgressListId, favoriteList) => {
    return listsById[workInProgressListId] || favoriteList;
  },
);

export const workInProgressItemsSelector = createSelector(
  itemsByIdSelector,
  workInProgressItemIdsSelector,
  (itemsById, workInProgressItemIds) =>
    workInProgressItemIds.map(itemId => itemsById[itemId]),
);

export const shouldLoadNodesSelector = createSelector(
  extendedSortedCustomizableListsSelector,
  lists => !lists.length,
);

export const visibleListItemsSelector = createSelector(
  listsByIdSelector,
  itemsByIdSelector,
  workInProgressListIdSelector,
  (listsById, itemsById, workInProgressListId) =>
    listsById && workInProgressListId && listsById[workInProgressListId]
      ? listsById[workInProgressListId].children.reduce(
          (accumulator, itemId) =>
            itemsById[itemId] && itemsById[itemId].data
              ? accumulator.concat(itemsById[itemId])
              : accumulator,
          [],
        )
      : [],
);
