import { connect } from 'react-redux';
import { createItemsBatchRequest } from '@caesar/common/actions/entities/item';
import { initWorkflow } from '@caesar/common/actions/workflow';
import {
  fetchKeyPairRequest,
  fetchUserSelfRequest,
} from '@caesar/common/actions/user';
import { createStructuredSelector } from 'reselect';
import { selectableTeamsListsSelector } from '@caesar/common/selectors/entities/list';
import { personalKeyPairSelector } from '@caesar/common/selectors/keyStore';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import Import from './Import';

const mapStateToProps = createStructuredSelector({
  teamsLists: selectableTeamsListsSelector,
  keyPair: personalKeyPairSelector,
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
