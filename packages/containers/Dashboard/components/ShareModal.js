import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  workInProgressItemSelector,
  workInProgressItemsSelector,
  workInProgressItemIdsSelector,
  workInProgressItemSharedMembersSelector,
} from '@caesar/common/selectors/workflow';
import { currentUserTeamListSelector } from '@caesar/common/selectors/currentUser';
import { resetWorkInProgressItemIds } from '@caesar/common/actions/workflow';
import {
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  shareItemBatchRequest,
  // removeShareRequest,
} from '@caesar/common/actions/entities/item';
import { ShareModal as ShareModalComponent } from '@caesar/components';

export const ShareModal = ({
  handleCloseModal,
  handleCtrlSelectionItemBehaviour,
}) => {
  const dispatch = useDispatch();
  const workInProgressItems = useSelector(workInProgressItemsSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const userTeamList = useSelector(currentUserTeamListSelector);
  const workInProgressItemSharedMembers = useSelector(
    workInProgressItemSharedMembersSelector,
  );

  const isMultiItem = workInProgressItemIds?.length > 0;
  const availableTeamsForSharing = userTeamList.filter(
    ({ id }) => id !== workInProgressItem?.teamId && id !== null,
  );

  const handleShare = (members, teamIds) => {
    if (members.length > 0 || teamIds.length > 0) {
      if (isMultiItem) {
        dispatch(
          shareItemBatchRequest({
            itemIds: workInProgressItemIds,
            members,
            teamIds,
          }),
        );
        dispatch(resetWorkInProgressItemIds());
      } else {
        dispatch(
          shareItemBatchRequest({
            itemIds: [workInProgressItem?.id],
            members,
            teamIds,
          }),
        );
      }
    }

    handleCloseModal();
  };

  const canRevokeAccess = false;
  const handleRevokeAccess = member => {
    // TODO: Implement revoke share access
    // dispatch(removeShareRequest());
    console.log('member: ', member);
  };

  const handleActivateLink = () => {
    dispatch(createAnonymousLinkRequest());
  };

  const handleDeactivateLink = () => {
    dispatch(removeAnonymousLinkRequest());
  };

  return (
    <ShareModalComponent
      items={workInProgressItems}
      teams={availableTeamsForSharing}
      sharedMembers={workInProgressItemSharedMembers}
      anonymousLink={workInProgressItem?.shared}
      isMultiMode={isMultiItem}
      onShare={handleShare}
      onRevokeAccess={canRevokeAccess ? handleRevokeAccess : null}
      onActivateLink={handleActivateLink}
      onDeactivateLink={handleDeactivateLink}
      onCancel={handleCloseModal}
      onRemove={handleCtrlSelectionItemBehaviour}
    />
  );
};
