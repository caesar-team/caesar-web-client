import { connect } from 'react-redux';
import { createItemsBatchRequest } from 'common/actions/entities/item';
import { initWorkflow } from 'common/actions/workflow';
import { fetchKeyPairRequest, fetchUserSelfRequest } from 'common/actions/user';
import { createStructuredSelector } from 'reselect';
import { selectableListsWithoutChildrenSelector } from 'common/selectors/entities/list';
import { keyPairSelector } from 'common/selectors/user';
import { isLoadingSelector } from 'common/selectors/workflow';
import Import from './Import';

const mapStateToProps = createStructuredSelector({
  lists: selectableListsWithoutChildrenSelector,
  keyPair: keyPairSelector,
  isLoading: isLoadingSelector,
});

const mapDispatchToProps = {
  initWorkflow,
  fetchKeyPairRequest,
  fetchUserSelfRequest,
  createItemsBatchRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Import);
