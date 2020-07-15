import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  workInProgressItemIdsSelector,
  workInProgressItemsSelector,
  workInProgressListIdSelector,
} from '@caesar/common/selectors/workflow';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { resetWorkInProgressItemIds } from '@caesar/common/actions/workflow';
import { MoveModal as MoveModalComponent } from '@caesar/components';

export const MoveModal = ({
  notification,
  handleCloseModal,
  handleCtrlSelectionItemBehaviour,
}) => {
  const dispatch = useDispatch();
  const workInProgressItems = useSelector(workInProgressItemsSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressListId = useSelector(workInProgressListIdSelector);
  const currentTeam = useSelector(currentTeamSelector);

  return (
    <MoveModalComponent
      items={workInProgressItems}
      currentTeamId={currentTeam?.id}
      currentListId={workInProgressListId}
      workInProgressItemIds={workInProgressItemIds}
      notification={notification}
      isMultiMode
      isOpened
      closeModal={handleCloseModal}
      onRemove={handleCtrlSelectionItemBehaviour}
    />
  );
};
