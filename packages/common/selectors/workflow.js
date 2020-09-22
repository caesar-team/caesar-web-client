import { createSelector } from 'reselect';
import { sortByDate } from '@caesar/common/utils/dateUtils';
import {
  listsByIdSelector,
  extendedSortedCustomizableListsSelector,
  favoriteListSelector,
  currentTeamFavoriteListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { ITEM_TYPE } from '../constants';

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
          userRole: team ? team.userRole : null,
          listType: list ? list.type : null,
        }
      : null;
  },
);

export const workInProgressItemOwnerSelector = createSelector(
  workInProgressItemSelector,
  membersByIdSelector,
  (workInProgressItem, membersById) =>
    workInProgressItem && Object.values(membersById).length
      ? membersById[workInProgressItem.ownerId]
      : null,
);

export const workInProgressItemChildItemsSelector = createSelector(
  workInProgressItemSelector,
  childItemsByIdSelector,
  (workInProgressItem, childItemsById) =>
    workInProgressItem && Object.values(childItemsById).length
      ? workInProgressItem.invited.map(id => childItemsById[id])
      : [],
);

export const workInProgressItemSharedMembersSelector = createSelector(
  workInProgressItemChildItemsSelector,
  membersByIdSelector,
  (workInProgressItemChildItems, membersById) =>
    workInProgressItemChildItems.length && Object.values(membersById).length
      ? workInProgressItemChildItems.reduce(
          (accumulator, { userId }) =>
            membersById[userId]
              ? [...accumulator, membersById[userId]]
              : accumulator,
          [],
        )
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
  teamsByIdSelector,
  workInProgressListIdSelector,
  (listsById, teamsById, workInProgressListId) => {
    const list = listsById[workInProgressListId];

    const userRole =
      list && list.teamId ? teamsById[list.teamId]?.userRole : null;

    return list
      ? {
          ...list,
          userRole,
        }
      : null;
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

const createListItemsList = (children, itemsById) =>
  children
    .reduce(
      (accumulator, itemId) =>
        itemsById[itemId]?.data && itemsById[itemId].type !== ITEM_TYPE.SYSTEM
          ? [...accumulator, itemsById[itemId]]
          : accumulator,
      [],
    )
    .sort((a, b) => sortByDate(a.lastUpdated, b.lastUpdated, 'DESC')) || [];

export const visibleListItemsSelector = createSelector(
  listsByIdSelector,
  itemsByIdSelector,
  workInProgressListIdSelector,
  favoriteListSelector,
  currentTeamFavoriteListSelector,
  (
    listsById,
    itemsById,
    workInProgressListId,
    personalFavoriteList,
    teamFavoriteList,
  ) => {
    const favoriteList = personalFavoriteList.id
      ? personalFavoriteList
      : teamFavoriteList;

    const isFavoriteList = workInProgressListId === favoriteList?.id;

    switch (true) {
      case isFavoriteList:
        return createListItemsList(favoriteList.children, itemsById);
      case !!listsById[workInProgressListId]:
        return createListItemsList(
          listsById[workInProgressListId].children,
          itemsById,
        );
      default:
        return [];
    }
  },
);
