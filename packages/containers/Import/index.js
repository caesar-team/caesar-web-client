import { connect } from 'react-redux';
import {
  createItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import { initDashboard } from '@caesar/common/actions/workflow';
import {
  fetchKeyPairRequest,
  fetchUserSelfRequest,
} from '@caesar/common/actions/currentUser';
import { createStructuredSelector } from 'reselect';
import { selectableTeamsListsSelector } from '@caesar/common/selectors/entities/list';
import { importProgressPercentSelector } from '@caesar/common/selectors/entities/item';
import { actualKeyPairSelector } from '@caesar/common/selectors/keystore';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import Import from './Import';

const mapStateToProps = createStructuredSelector({
  teamsLists: selectableTeamsListsSelector,
  keyPair: actualKeyPairSelector,
  isLoading: isLoadingSelector,
  importProgress: importProgressPercentSelector,
});

const mapDispatchToProps = {
  initDashboard,
  fetchKeyPairRequest,
  fetchUserSelfRequest,
  createItemsBatchRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Import);
