import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  DASHBOARD_DEFAULT_MODE,
  INBOX_TYPE,
  DASHBOARD_SEARCH_MODE,
} from '@caesar/common/constants';
import { MultiItem, List } from '@caesar/components';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
} from '@caesar/common/selectors/workflow';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import {
  SHARE_MODAL,
  MOVE_ITEM_MODAL,
  MOVE_TO_TRASH_MODAL,
  REMOVE_ITEM_MODAL,
} from '../constants';

const MiddleColumnComponent = ({
  mode,
  searchedItems,
  handleClickItem,
  handleOpenModal,
  handleSelectAllListItems,
}) => {
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const visibleListItems = useSelector(visibleListItemsSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);

  const isMultiItem = workInProgressItemIds && workInProgressItemIds.length > 0;
  const isInboxList =
    workInProgressList && workInProgressList.type === INBOX_TYPE;
  const isTrashList =
    workInProgressList &&
    (workInProgressList.id === trashList.id ||
      teamsTrashLists.map(({ id }) => id).includes(workInProgressList.id));

  const areAllItemsSelected =
    mode === DASHBOARD_SEARCH_MODE
      ? searchedItems.length === workInProgressItemIds.length
      : visibleListItems.length === workInProgressItemIds.length;

  return (
    <>
      {isMultiItem && (
        // TODO: Redesign MultiItem?
        <MultiItem
          isInboxItems={isInboxList}
          isTrashItems={isTrashList}
          workInProgressItemIds={workInProgressItemIds}
          areAllItemsSelected={areAllItemsSelected}
          onClickMove={handleOpenModal(MOVE_ITEM_MODAL)}
          onClickMoveToTrash={handleOpenModal(MOVE_TO_TRASH_MODAL)}
          onClickRemove={handleOpenModal(REMOVE_ITEM_MODAL)}
          onClickShare={handleOpenModal(SHARE_MODAL)}
          onSelectAll={handleSelectAllListItems}
        />
      )}
      <List
        mode={mode}
        isMultiItem={isMultiItem}
        workInProgressList={workInProgressList}
        workInProgressItem={workInProgressItem}
        workInProgressItemIds={workInProgressItemIds}
        items={
          mode === DASHBOARD_DEFAULT_MODE ? visibleListItems : searchedItems
        }
        onClickItem={handleClickItem}
      />
    </>
  );
};

export const MiddleColumn = memo(MiddleColumnComponent);
