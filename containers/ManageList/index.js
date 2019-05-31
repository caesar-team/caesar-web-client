import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  extendedSortedCustomizableListsSelector,
  workInProgressListSelector,
} from 'common/selectors/node';
import { userDataSelector } from 'common/selectors/user';
import { byIdSelector } from 'common/selectors/member';
import {
  fetchNodesRequest,
  createListRequest,
  editListRequest,
  removeListRequest,
  sortListRequest,
  setWorkInProgressListId,
} from 'common/actions/node';
import { fetchMembersRequest } from 'common/actions/member';
import { fetchUserSelfRequest, fetchKeyPairRequest } from 'common/actions/user';
import ManageList from './ManageList';

const mapStateToProps = createStructuredSelector({
  lists: extendedSortedCustomizableListsSelector,
  members: byIdSelector,
  user: userDataSelector,
  workInProgressList: workInProgressListSelector,
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
  fetchNodesRequest,
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
