import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchNodesRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
  moveItemRequest,
  createItemRequest,
  editItemRequest,
  removeItemRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  changeItemPermissionRequest,
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemRequest,
  removeShareRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  toggleItemToFavoriteRequest,
} from 'common/actions/node';
import { fetchKeyPairRequest, fetchUserSelfRequest } from 'common/actions/user';
import { fetchMembersRequest } from 'common/actions/member';
import {
  selectableListsSelector,
  itemsByIdSelector,
  workInProgressItemSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
  listsByTypeSelector,
  isLoadingSelector,
} from 'common/selectors/node';
import { keyPairSelector, userDataSelector } from 'common/selectors/user';
import { byIdSelector } from 'common/selectors/member';
import Dashboard from './Dashboard';

const mapStateToProps = createStructuredSelector({
  lists: selectableListsSelector,
  listsByType: listsByTypeSelector,
  itemsById: itemsByIdSelector,
  workInProgressItem: workInProgressItemSelector,
  workInProgressList: workInProgressListSelector,
  visibleListItems: visibleListItemsSelector,
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
  createItemRequest,
  editItemRequest,
  removeItemRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  changeItemPermissionRequest,
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  shareItemRequest,
  removeShareRequest,
  createAnonymousLinkRequest,
  removeAnonymousLinkRequest,
  toggleItemToFavoriteRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
