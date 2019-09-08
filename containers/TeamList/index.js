import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
} from 'common/actions/entities/team';
import { teamListSelector, isLoadingSelector } from 'common/selectors/entities/team';
import { userTeamListSelector } from 'common/selectors/user';
import { memberListSelector } from 'common/selectors/entities/member';
import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  teamList: teamListSelector,
  userTeamList: userTeamListSelector,
  members: memberListSelector,
});

const mapDispatchToProps = {
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
