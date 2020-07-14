import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DASHBOARD_MODE,
  ITEM_MODE,
  LIST_TYPE,
  MOVE_ITEM_PERMISSION,
  SHARE_ITEM_PERMISSION,
  DELETE_PERMISSION,
} from '@caesar/common/constants';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
} from '@caesar/common/selectors/workflow';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import {
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { MultiItem, List } from '@caesar/components';
import { MODAL } from '../constants';
import { filter } from '../utils';

const MiddleColumnComponent = ({
  mode,
  searchedText,
  handleOpenModal,
  startCtrlShiftSelectionItemId,
  setStartCtrlShiftSelectionItemId,
  handleCtrlSelectionItemBehaviour,
}) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const visibleListItems = useSelector(visibleListItemsSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const itemsById = useSelector(itemsByIdSelector);

  const isMultiItem = workInProgressItemIds?.length > 0;
  const isInboxList = workInProgressList?.type === LIST_TYPE.INBOX;
  const isTrashList =
    (workInProgressList?.id === trashList?.id ||
      teamsTrashLists?.map(({ id }) => id).includes(workInProgressList?.id));

  const searchedItems = filter(Object.values(itemsById), searchedText);

  const areAllItemsSelected =
    mode === DASHBOARD_MODE.SEARCH
      ? searchedItems.length === workInProgressItemIds.length
      : visibleListItems.length === workInProgressItemIds.length;

  const handleDefaultSelectionItemBehaviour = itemId => {
    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressItem(itemsById[itemId], ITEM_MODE.REVIEW));
  };

  const handleCtrlShiftSelectionItemBehaviour = itemId => {
    if (!startCtrlShiftSelectionItemId) {
      setStartCtrlShiftSelectionItemId(itemId);

      dispatch(setWorkInProgressItem(null));
      dispatch(setWorkInProgressItemIds([itemId]));
    } else {
      setStartCtrlShiftSelectionItemId(null);

      const startIndex = visibleListItems.findIndex(
        ({ id }) => id === startCtrlShiftSelectionItemId,
      );
      const endIndex = visibleListItems.findIndex(({ id }) => id === itemId);

      const slicedItems = visibleListItems.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1,
      );

      dispatch(setWorkInProgressItemIds(slicedItems.map(({ id }) => id)));
    }
  };

  const handleClickItem = itemId => event => {
    const item = itemsById[itemId];

    const itemSubject = {
      ...item,
      listType: workInProgressList && workInProgressList.type,
      userRole: workInProgressList && workInProgressList.userRole,
    };

    // TODO:
    // const teamItemGuard =
    //   this.context.can(MOVE_ITEM_PERMISSION, itemSubject) &&
    //   this.context.can(SHARE_ITEM_PERMISSION, itemSubject) &&
    //   this.context.can(DELETE_PERMISSION, itemSubject);

    // if (itemSubject.teamId && !teamItemGuard) {
    if (itemSubject.teamId) {
      handleDefaultSelectionItemBehaviour(itemId);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      handleCtrlShiftSelectionItemBehaviour(itemId);
    } else if (event.ctrlKey || event.metaKey) {
      handleCtrlSelectionItemBehaviour(itemId);
    } else {
      handleDefaultSelectionItemBehaviour(itemId);
    }
  };

  const handleSelectAllListItems = event => {
    const { checked } = event.currentTarget;

    if (mode === DASHBOARD_MODE.SEARCH) {
      dispatch(
        setWorkInProgressItemIds(
          checked
            ? filter(Object.values(itemsById), searchedText).map(({ id }) => id)
            : [],
        ),
      );
    } else {
      dispatch(
        setWorkInProgressItemIds(
          checked ? visibleListItems.map(({ id }) => id) : [],
        ),
      );
    }
  };

  return (
    <>
      {isMultiItem && (
        <MultiItem
          isInboxItems={isInboxList}
          isTrashItems={isTrashList}
          workInProgressItemIds={workInProgressItemIds}
          areAllItemsSelected={areAllItemsSelected}
          onClickMove={handleOpenModal(MODAL.MOVE_ITEM)}
          onClickMoveToTrash={handleOpenModal(MODAL.MOVE_TO_TRASH)}
          onClickRemove={handleOpenModal(MODAL.REMOVE_ITEM)}
          onClickShare={handleOpenModal(MODAL.SHARE)}
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
          mode === DASHBOARD_MODE.DEFAULT ? visibleListItems : searchedItems
        }
        onClickItem={handleClickItem}
      />
    </>
  );
};

export const MiddleColumn = memo(MiddleColumnComponent);
