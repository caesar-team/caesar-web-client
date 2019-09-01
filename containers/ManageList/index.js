import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { extendedSortedCustomizableListsSelector } from 'common/selectors/list';
import {
  workInProgressListSelector,
  isLoadingSelector,
  shouldLoadNodesSelector,
} from 'common/selectors/workflow';
import { userDataSelector } from 'common/selectors/user';
import { membersByIdSelector } from 'common/selectors/member';
import {
  createListRequest,
  editListRequest,
  removeListRequest,
  sortListRequest,
} from 'common/actions/list';
import {
  initPreparationDataFlow,
  setWorkInProgressListId,
} from 'common/actions/workflow';
import { fetchMembersRequest } from 'common/actions/member';
import { fetchUserSelfRequest, fetchKeyPairRequest } from 'common/actions/user';
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
  initPreparationDataFlow,
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
