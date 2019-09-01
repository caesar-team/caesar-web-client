import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchTeamsRequest } from 'common/actions/team';
import { fetchUserTeamsRequest } from 'common/actions/user';
import { teamListSelector, isLoadingSelector } from 'common/selectors/team';
import { userTeamListSelector } from 'common/selectors/user';

import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  teamListSelector: teamListSelector,
  userTeamList: userTeamListSelector,
});

const mapDispatchToProps = {
  fetchTeamsRequest,
  fetchUserTeamsRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
