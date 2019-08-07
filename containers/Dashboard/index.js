import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchNodesRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
  moveItemRequest,
  moveItemsBatchRequest,
  createItemRequest,
  editItemRequest,
  removeItemRequest,
  removeItemsBatchRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  changeItemPermissionRequest,
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemRequest,
  shareItemBatchRequest,
  removeShareRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  toggleItemToFavoriteRequest,
  resetStore,
} from 'common/actions/node';
import { fetchKeyPairRequest, fetchUserSelfRequest } from 'common/actions/user';
import { fetchMembersRequest } from 'common/actions/member';
import {
  selectableListsWithoutChildrenSelector,
  itemsByIdSelector,
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
  listsByTypeSelector,
  isLoadingSelector,
  trashListSelector,
} from 'common/selectors/node';
import { keyPairSelector, userDataSelector } from 'common/selectors/user';
import { byIdSelector } from 'common/selectors/member';
import Dashboard from './Dashboard';

const mapStateToProps = createStructuredSelector({
  lists: selectableListsWithoutChildrenSelector,
  listsByType: listsByTypeSelector,
  itemsById: itemsByIdSelector,
  workInProgressItem: workInProgressItemSelector,
  workInProgressItemIds: workInProgressItemIdsSelector,
  workInProgressList: workInProgressListSelector,
  visibleListItems: visibleListItemsSelector,
  trashList: trashListSelector,
  keyPair: keyPairSelector,
  members: byIdSelector,
  user: userDataSelector,
  isLoading: isLoadingSelector,
});

const mapDispatchToProps = {
  fetchNodesRequest,
  fetchKeyPairRequest,
  fetchMembersRequest,
  fetchUserSelfRequest,
  moveItemRequest,
  moveItemsBatchRequest,
  createItemRequest,
  editItemRequest,
  removeItemRequest,
  removeItemsBatchRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  changeItemPermissionRequest,
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemRequest,
  shareItemBatchRequest,
  removeShareRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  toggleItemToFavoriteRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
  resetStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
