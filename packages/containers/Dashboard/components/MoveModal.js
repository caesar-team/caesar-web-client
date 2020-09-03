import React from 'react';
import { useSelector } from 'react-redux';
import {
  workInProgressItemIdsSelector,
  workInProgressItemsSelector,
  workInProgressListIdSelector,
} from '@caesar/common/selectors/workflow';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { MoveModal as MoveModalComponent } from '@caesar/components';

export const MoveModal = ({
  handleCloseModal,
  handleCtrlSelectionItemBehaviour,
}) => {
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
      isMultiMode
      isOpened
      closeModal={handleCloseModal}
      onRemove={handleCtrlSelectionItemBehaviour}
    />
  );
};
