import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressItemSharedMembersSelector,
} from '@caesar/common/selectors/workflow';
import { userTeamListSelector } from '@caesar/common/selectors/user';
import { resetWorkInProgressItemIds } from '@caesar/common/actions/workflow';
import {
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  shareItemBatchRequest,
  removeShareRequest,
} from '@caesar/common/actions/entities/item';
import { ShareModal as ShareModalComponent } from '@caesar/components';

export const ShareModal = ({ notification, handleCloseModal }) => {
  const dispatch = useDispatch();
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const userTeamList = useSelector(userTeamListSelector);
  const workInProgressItemSharedMembers = useSelector(
    workInProgressItemSharedMembersSelector,
  );

  const isTeamItem = workInProgressItem && workInProgressItem.teamId;
  const isMultiItem = workInProgressItemIds && workInProgressItemIds.length > 0;
  const availableTeamsForSharing = isTeamItem
    ? userTeamList.filter(({ id }) => id !== workInProgressItem.teamId)
    : userTeamList;

  const handleShare = (members, teamIds) => {
    if (members.length > 0 || teamIds.length > 0) {
      if (workInProgressItemIds && workInProgressItemIds.length > 0) {
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
            itemIds: [workInProgressItem.id],
            members,
            teamIds,
          }),
        );
      }
    }

    handleCloseModal();
  };

  const handleRemoveShare = shareId => () => {
    dispatch(removeShareRequest(shareId));
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
      anonymousLink={workInProgressItem && workInProgressItem.shared}
      withAnonymousLink={!isMultiItem}
      onShare={handleShare}
      onRemove={handleRemoveShare}
      onActivateLink={handleActivateLink}
      onDeactivateLink={handleDeactivateLink}
      onCancel={handleCloseModal}
      notification={notification}
    />
  );
};
