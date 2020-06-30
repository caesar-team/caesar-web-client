import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPlural } from '@caesar/common/utils/string';
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

export const ConfirmRemoveItemModal = ({ isOpened, handleCloseModal }) => {
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

  const pluralItemText = getPlural(workInProgressItemIds?.length, [
    'item',
    'items',
  ]);

  return (
    <ConfirmModal
      isOpened={isOpened}
      title={`You are going to delete ${
        workInProgressItem
          ? `'${workInProgressItem.data.name}'`
          : pluralItemText
      }`}
      description={`Are you sure you want to delete the ${
        workInProgressItem ? 'item' : pluralItemText
      }?`}
      icon="trash"
      confirmBtnText="Delete"
      onClickConfirm={handleRemoveItem}
      onClickCancel={handleCloseModal}
    />
  );
};
