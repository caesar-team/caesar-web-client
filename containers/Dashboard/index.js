import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchNodesRequest,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  setWorkInProgressListId,
  resetWorkInProgressItemIds,
} from 'common/actions/workflow';
import {
  moveItemRequest,
  moveItemsBatchRequest,
  createItemRequest,
  editItemRequest,
  removeItemRequest,
  removeItemsBatchRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  toggleItemToFavoriteRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
} from 'common/actions/item';
import {
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemBatchRequest,
  removeShareRequest,
  changeChildItemPermissionRequest,
} from 'common/actions/childItem';
import { fetchKeyPairRequest, fetchUserSelfRequest } from 'common/actions/user';
import { fetchMembersRequest } from 'common/actions/member';
import {
  isLoadingSelector,
  workInProgressItemSelector,
  workInProgressItemChildItemsSelector,
  workInProgressItemIdsSelector,
  workInProgressItemsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
} from 'common/selectors/workflow';
import {
  selectableListsWithoutChildrenSelector,
  listsByTypeSelector,
  trashListSelector,
} from 'common/selectors/list';
import { itemsByIdSelector } from 'common/selectors/item';
import { keyPairSelector, userDataSelector } from 'common/selectors/user';
import { byIdSelector } from 'common/selectors/member';
import Dashboard from './Dashboard';

const mapStateToProps = createStructuredSelector({
  lists: selectableListsWithoutChildrenSelector,
  listsByType: listsByTypeSelector,
  itemsById: itemsByIdSelector,
  workInProgressItem: workInProgressItemSelector,
  workInProgressItemChildItems: workInProgressItemChildItemsSelector,
  workInProgressItemIds: workInProgressItemIdsSelector,
  workInProgressList: workInProgressListSelector,
  visibleListItems: visibleListItemsSelector,
  workInProgressItems: workInProgressItemsSelector,
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
  changeChildItemPermissionRequest,
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemBatchRequest,
  removeShareRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  toggleItemToFavoriteRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
