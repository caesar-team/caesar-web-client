import { connect } from 'react-redux';
import { createItemsBatchRequest } from 'common/actions/item';
import { initPreparationDataFlow } from 'common/actions/workflow';
import { fetchKeyPairRequest, fetchUserSelfRequest } from 'common/actions/user';
import { createStructuredSelector } from 'reselect';
import { selectableListsWithoutChildrenSelector } from 'common/selectors/list';
import { keyPairSelector } from 'common/selectors/user';
import { isLoadingSelector } from 'common/selectors/workflow';
import Import from './Import';

const mapStateToProps = createStructuredSelector({
  lists: selectableListsWithoutChildrenSelector,
  keyPair: keyPairSelector,
  isLoading: isLoadingSelector,
});

const mapDispatchToProps = {
  initPreparationDataFlow,
  fetchKeyPairRequest,
  fetchUserSelfRequest,
  createItemsBatchRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Import);
