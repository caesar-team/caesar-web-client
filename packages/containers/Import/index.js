import { connect } from 'react-redux';
import { createItemsBatchRequest } from '@caesar/common/actions/entities/item';
import { createStructuredSelector } from 'reselect';
import {
  selectableTeamsListsSelector,
  currentTeamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import { importProgressPercentSelector } from '@caesar/common/selectors/entities/item';
import { actualKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  isLoadingSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import {
  currentUserVaultListSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/currentUser';
import { fetchTeamListsRequest } from '@caesar/common/actions/entities/team';
import Import from './Import';

const mapStateToProps = createStructuredSelector({
  teamsLists: selectableTeamsListsSelector,
  currentUserTeamsList: currentUserVaultListSelector,
  keyPair: actualKeyPairSelector,
  isLoading: isLoadingSelector,
  importProgress: importProgressPercentSelector,
  currentUserTeamId: currentTeamIdSelector,
  currentList: workInProgressListSelector,
  currentTeamDefaultList: currentTeamDefaultListSelector,
});

const mapDispatchToProps = {
  createItemsBatchRequest,
  fetchTeamListsRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Import);
