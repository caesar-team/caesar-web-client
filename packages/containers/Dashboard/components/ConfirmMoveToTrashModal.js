import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ITEM_TEXT_TYPE } from '@caesar/common/constants';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  moveItemRequest,
  moveItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import { ConfirmModal } from '@caesar/components';

export const ConfirmMoveToTrashModal = ({
  notification,
  isOpen,
  handleCloseModal,
}) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const trashList = useSelector(trashListSelector);

  const handleMoveToTrash = () => {
    const isTeamList = workInProgressList && !!workInProgressList.teamId;
    const trashListId = isTeamList
      ? teamsTrashLists.find(
          ({ teamId }) => teamId === workInProgressList.teamId,
        ).id
      : trashList.id;

    if (workInProgressItemIds.length > 0) {
      dispatch(moveItemsBatchRequest(workInProgressItemIds, trashListId));
      dispatch(resetWorkInProgressItemIds());

      notification.show({
        text: `The items have been removed`,
      });
    } else {
      dispatch(moveItemRequest(workInProgressItem.id, trashListId));
      dispatch(setWorkInProgressItem(null));

      notification.show({
        text: `The ${ITEM_TEXT_TYPE[workInProgressItem.type]} has been removed`,
      });
    }

    handleCloseModal();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      description="Are you sure you want to move the item(-s) to trash?"
      onClickOk={handleMoveToTrash}
      onClickCancel={handleCloseModal}
    />
  );
};
