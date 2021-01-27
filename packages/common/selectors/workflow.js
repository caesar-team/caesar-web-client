import { createSelector } from 'reselect';
import { LIST_TYPE } from '@caesar/common/constants';
import {
  listsByIdSelector,
  favoritesListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import { usersByIdSelector } from '@caesar/common/selectors/entities/user';

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
  workflow => {
    const { workInProgressItem } = workflow;

    return workInProgressItem;
  },
);

export const workInProgressItemOwnerSelector = createSelector(
  workInProgressItemSelector,
  usersByIdSelector,
  (workInProgressItem, usersById) =>
    workInProgressItem && Object.values(usersById).length
      ? usersById[workInProgressItem.ownerId]
      : null,
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
  favoritesListSelector,
  (listsById, workInProgressListId, favoritesList) => {
    const list =
      workInProgressListId === LIST_TYPE.FAVORITES
        ? favoritesList
        : listsById[workInProgressListId];

    return list || null;
  },
);

export const workInProgressItemsSelector = createSelector(
  itemsByIdSelector,
  workInProgressItemIdsSelector,
  (itemsById, workInProgressItemIds) =>
    workInProgressItemIds.map(itemId => itemsById[itemId]),
);

export const workInProgressItemSharedMembersSelector = createSelector(
  workInProgressItemSelector,
  usersByIdSelector,
  (workInProgressItem, usersById) =>
    workInProgressItem?.invited?.map(userId => usersById[userId]) || [],
);

export const isDecryptionProgressSelector = createSelector(
  workflowSelector,
  workflow => workflow.isDecryptionProgress,
);

export const isVaultLoadingSelector = createSelector(
  workflowSelector,
  workflow => workflow.isVaultLoading,
);
