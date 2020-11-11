import { createSelector } from 'reselect';
import { LIST_TYPE } from '@caesar/common/constants';
import {
  listsByIdSelector,
  favoritesListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import { usersByIdSelector } from '@caesar/common/selectors/entities/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';

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
  teamsByIdSelector,
  listsByIdSelector,
  (workflow, teamsById, listById) => {
    const { workInProgressItem } = workflow;

    const list =
      workInProgressItem && workInProgressItem.listId
        ? listById[workInProgressItem.listId]
        : null;

    const team =
      workInProgressItem && workInProgressItem.teamId
        ? teamsById[workInProgressItem.teamId]
        : null;

    return workInProgressItem
      ? {
          ...workInProgressItem,
          teamRole: team ? team.teamRole : null,
          listType: list ? list.type : null,
        }
      : null;
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
  teamsByIdSelector,
  workInProgressListIdSelector,
  favoritesListSelector,
  (listsById, teamsById, workInProgressListId, favoritesList) => {
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
    workInProgressItem?.invited?.reduce((acc, userId) => {
      const user = usersById[userId];

      return user ? [...acc, user] : acc;
    }, []) || [],
);
