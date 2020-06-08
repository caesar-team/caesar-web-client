import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectableTeamsListsSelector } from '@caesar/common/selectors/entities/list';
import {
  workInProgressItemIdsSelector,
  workInProgressItemsSelector,
} from '@caesar/common/selectors/workflow';
import { moveItemsBatchRequest } from '@caesar/common/actions/entities/item';
import { resetWorkInProgressItemIds } from '@caesar/common/actions/workflow';
import { MoveModal as MoveModalComponent } from '@caesar/components';

export const MoveModal = ({
  notification,
  handleCloseModal,
  handleCtrlSelectionItemBehaviour,
}) => {
  const dispatch = useDispatch();
  const selectableTeamsLists = useSelector(selectableTeamsListsSelector);
  const workInProgressItems = useSelector(workInProgressItemsSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);

  const handleClickMoveItems = listId => {
    dispatch(moveItemsBatchRequest(workInProgressItemIds, listId));
    dispatch(resetWorkInProgressItemIds());

    notification.show({
      text: 'The items have moved.',
    });

    handleCloseModal();
  };

  return (
    <MoveModalComponent
      teamsLists={selectableTeamsLists}
      items={workInProgressItems}
      onMove={handleClickMoveItems}
      onCancel={handleCloseModal}
      onRemove={handleCtrlSelectionItemBehaviour}
    />
  );
};
