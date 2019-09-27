import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  initWorkflow,
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
import { changeChildItemPermissionRequest } from 'common/actions/entities/childItem';
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
  personalListsByTypeSelector,
  trashListSelector,
  teamsTrashListsSelector,
  currentTeamListsSelector,
  selectableTeamsListsSelector,
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
  teamLists: currentTeamListsSelector,
  userTeamList: userTeamListSelector,
  personalListsByType: personalListsByTypeSelector,
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
  teamsTrashLists: teamsTrashListsSelector,
  keyPair: keyPairSelector,
  membersById: membersByIdSelector,
  selectableTeamsLists: selectableTeamsListsSelector,
  user: userDataSelector,
  team: currentTeamSelector,
  isLoading: isLoadingSelector,
});

const mapDispatchToProps = {
  initWorkflow,
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
