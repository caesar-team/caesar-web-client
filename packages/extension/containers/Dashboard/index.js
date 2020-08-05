import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchNodesRequest,
  setWorkInProgressListId,
  setWorkInProgressItem,
} from '../../../common/actions/node';
import {
  isLoadingSelector,
  userListsSelector,
  favoriteListSelector,
  itemsByIdSelector,
  workInProgressListSelector,
  workInProgressItemSelector,
  visibleListItemsSelector,
} from '../../../common/selectors/node';

import Dashboard from './Dashboard';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  lists: userListsSelector,
  favoritesList: favoriteListSelector,
  itemsById: itemsByIdSelector,
  visibleListItems: visibleListItemsSelector,
  workInProgressList: workInProgressListSelector,
  workInProgressItem: workInProgressItemSelector,
});

const mapDispatchToProps = {
  fetchNodesRequest,
  setWorkInProgressItem,
  setWorkInProgressListId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
