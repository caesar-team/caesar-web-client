import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { extendedSortedCustomizableListsSelector } from '@caesar/common/selectors/entities/list';
import {
  workInProgressListSelector,
  isLoadingSelector,
  shouldLoadNodesSelector,
} from '@caesar/common/selectors/workflow';
import { userDataSelector } from '@caesar/common/selectors/user';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import {
  createListRequest,
  editListRequest,
  removeListRequest,
  sortListRequest,
} from '@caesar/common/actions/entities/list';
import {
  initWorkflow,
  setWorkInProgressListId,
} from '@caesar/common/actions/workflow';
import { fetchMembersRequest } from '@caesar/common/actions/entities/member';
import {
  fetchUserSelfRequest,
  fetchKeyPairRequest,
} from '@caesar/common/actions/user';
import ManageList from './ManageList';

const mapStateToProps = createStructuredSelector({
  lists: extendedSortedCustomizableListsSelector,
  members: membersByIdSelector,
  user: userDataSelector,
  workInProgressList: workInProgressListSelector,
  isLoading: isLoadingSelector,
  shouldLoadNodes: shouldLoadNodesSelector,
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
  initWorkflow,
  fetchMembersRequest,
  fetchUserSelfRequest,
  createListRequest,
  editListRequest,
  removeListRequest,
  sortListRequest,
  setWorkInProgressListId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageList);
