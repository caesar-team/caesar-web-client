import { createSelector } from 'reselect';
import { LIST_TYPE } from '@caesar/common/constants';
import { sortByDate } from '@caesar/common/utils/dateUtils';
import {
  listsByIdSelector,
  favoritesListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { isGeneralItem } from '../utils/item';

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

const createListItemsList = (children, itemsById) =>
  children
    .reduce((accumulator, itemId) => {
      const item = itemsById[itemId];

      return isGeneralItem(item) ? [...accumulator, item] : accumulator;
    }, [])
    .sort((a, b) => sortByDate(a.lastUpdated, b.lastUpdated, 'DESC')) || [];

export const visibleListItemsSelector = createSelector(
  listsByIdSelector,
  itemsByIdSelector,
  workInProgressListIdSelector,
  favoritesListSelector,
  (listsById, itemsById, workInProgressListId, favoriteList) => {
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
