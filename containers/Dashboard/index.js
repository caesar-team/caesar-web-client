import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  initPreparationDataFlow,
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
  shareItemBatchRequest,
  removeShareRequest,
} from 'common/actions/entities/item';
import {
  inviteMemberRequest,
  inviteNewMemberRequest,
  removeInviteMemberRequest,
  changeChildItemPermissionRequest,
} from 'common/actions/entities/childItem';
import {
  fetchKeyPairRequest,
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from 'common/actions/user';
import { fetchTeamsRequest } from 'common/actions/entities/team';
import {
  isLoadingSelector,
  workInProgressItemSelector,
  workInProgressItemOwnerSelector,
  workInProgressItemChildItemsSelector,
  workInProgressItemSharedMembersSelector,
  workInProgressItemIdsSelector,
  workInProgressItemsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
} from 'common/selectors/workflow';
import {
  selectableListsWithoutChildrenSelector,
  listsByTypeSelector,
  trashListSelector,
  currentTeamListsSelector,
} from 'common/selectors/entities/list';
import { itemsByIdSelector } from 'common/selectors/entities/item';
import {
  keyPairSelector,
  userDataSelector,
  currentTeamSelector,
  userTeamListSelector,
} from 'common/selectors/user';
import { membersByIdSelector } from 'common/selectors/entities/member';
import Dashboard from './Dashboard';

const mapStateToProps = createStructuredSelector({
  personalLists: selectableListsWithoutChildrenSelector,
  teamLists: currentTeamListsSelector,
  userTeamList: userTeamListSelector,
  listsByType: listsByTypeSelector,
  itemsById: itemsByIdSelector,
  workInProgressItem: workInProgressItemSelector,
  workInProgressItemOwner: workInProgressItemOwnerSelector,
  workInProgressItemChildItems: workInProgressItemChildItemsSelector,
  workInProgressItemSharedMembers: workInProgressItemSharedMembersSelector,
  workInProgressItemIds: workInProgressItemIdsSelector,
  workInProgressList: workInProgressListSelector,
  visibleListItems: visibleListItemsSelector,
  workInProgressItems: workInProgressItemsSelector,
  trashList: trashListSelector,
  keyPair: keyPairSelector,
  membersById: membersByIdSelector,
  user: userDataSelector,
  team: currentTeamSelector,
  isLoading: isLoadingSelector,
});

const mapDispatchToProps = {
  initPreparationDataFlow,
  fetchKeyPairRequest,
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
  fetchTeamsRequest,
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
