import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressItemSharedMembersSelector,
} from '@caesar/common/selectors/workflow';
import { userTeamListSelector } from '@caesar/common/selectors/user';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { resetWorkInProgressItemIds } from '@caesar/common/actions/workflow';
import {
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  shareItemBatchRequest,
  removeShareRequest,
} from '@caesar/common/actions/entities/item';
import { ShareModal as ShareModalComponent } from '@caesar/components';

export const ShareModal = ({ handleCloseModal }) => {
  const dispatch = useDispatch();
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const userTeamList = useSelector(userTeamListSelector);
  const workInProgressItemSharedMembers = useSelector(
    workInProgressItemSharedMembersSelector,
  );
  const childItemsById = useSelector(childItemsByIdSelector);

  const isMultiItem = workInProgressItemIds?.length > 0;
  const availableTeamsForSharing = userTeamList.filter(
    ({ id }) => id !== workInProgressItem?.teamId && id !== null,
  );

  const handleShare = (members, teamIds) => {
    if (members.length > 0 || teamIds.length > 0) {
      if (workInProgressItemIds?.length > 0) {
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

  const handleRevokeAccess = member => {
    const childItem = Object.values(childItemsById).filter(
      item =>
        item.originalItemId === workInProgressItem?.id &&
        item.userId === member.id,
    );
    const childItemId = childItem[0]?.id;

    if (childItemId) {
      dispatch(removeShareRequest(childItemId));
    }
  };

  const handleActivateLink = () => {
    dispatch(createAnonymousLinkRequest());
  };

  const handleDeactivateLink = () => {
    dispatch(removeAnonymousLinkRequest());
  };

  return (
    <ShareModalComponent
      teams={availableTeamsForSharing}
      sharedMembers={workInProgressItemSharedMembers}
      anonymousLink={workInProgressItem?.shared}
      withAnonymousLink={!isMultiItem}
      onShare={handleShare}
      onRevokeAccess={handleRevokeAccess}
      onActivateLink={handleActivateLink}
      onDeactivateLink={handleDeactivateLink}
      onCancel={handleCloseModal}
    />
  );
};
