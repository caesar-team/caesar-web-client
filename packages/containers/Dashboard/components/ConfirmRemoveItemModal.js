import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  removeItemRequest,
  removeItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import { ConfirmModal } from '@caesar/components';

export const ConfirmRemoveItemModal = ({ isOpen, handleCloseModal }) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const workInProgressList = useSelector(workInProgressListSelector);

  const handleRemoveItem = () => {
    if (workInProgressItemIds.length > 0) {
      dispatch(removeItemsBatchRequest(workInProgressList.id));
      dispatch(resetWorkInProgressItemIds());
    } else {
      dispatch(
        removeItemRequest(workInProgressItem.id, workInProgressItem.listId),
      );
      dispatch(setWorkInProgressItem(null));
    }

    handleCloseModal();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      description="Are you sure you want to delete the item(-s)?"
      onClickConfirm={handleRemoveItem}
      onClickCancel={handleCloseModal}
    />
  );
};
