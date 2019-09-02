import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchTeamsRequest, createTeamRequest } from 'common/actions/team';
import { teamListSelector, isLoadingSelector } from 'common/selectors/team';
import { userTeamListSelector } from 'common/selectors/user';
import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  teamList: teamListSelector,
  userTeamList: userTeamListSelector,
});

const mapDispatchToProps = {
  fetchTeamsRequest,
  createTeamRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
