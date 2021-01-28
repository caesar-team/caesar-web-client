import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNotification } from '@caesar/common/hooks';
import { getPlural } from '@caesar/common/utils/string';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import { currentTeamTrashListSelector } from '@caesar/common/selectors/entities/list';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  moveItemRequest,
  moveItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import { ConfirmModal } from '@caesar/components';

export const ConfirmMoveToTrashModal = ({ isOpened, handleCloseModal }) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const trashList = useSelector(currentTeamTrashListSelector);
  const notification = useNotification();

  const handleMoveToTrash = () => {
    if (workInProgressItemIds.length > 0) {
      dispatch(
        moveItemsBatchRequest({
          itemIds: workInProgressItemIds,
          oldTeamId: workInProgressList?.teamId,
          previousListId: workInProgressList.id,
          teamId: workInProgressList?.teamId,
          listId: trashList.id,
          notification,
          notificationText: `The ${getPlural(workInProgressItemIds?.length, [
            'item has',
            'items have',
          ])} been removed`,
        }),
      );
      dispatch(resetWorkInProgressItemIds());
    } else {
      dispatch(
        moveItemRequest({
          itemId: workInProgressItem.id,
          teamId: workInProgressItem.teamId,
          listId: trashList.id,
          notification,
          notificationText: `The '${workInProgressItem.data.name}' has been removed`,
        }),
      );
      dispatch(setWorkInProgressItem(null));
    }

    handleCloseModal();
  };

  const pluralItemText = getPlural(workInProgressItemIds?.length, [
    'item',
    'items',
  ]);

  return (
    <ConfirmModal
      isOpened={isOpened}
      title={`You are going to remove ${
        workInProgressItem
          ? `'${workInProgressItem.data.name}'`
          : pluralItemText
      }`}
      description={`Are you sure you want to move the ${
        workInProgressItem ? 'item' : pluralItemText
      } to the trash?`}
      icon="trash"
      confirmBtnText="Remove"
      onClickConfirm={handleMoveToTrash}
      onClickCancel={handleCloseModal}
    />
  );
};
