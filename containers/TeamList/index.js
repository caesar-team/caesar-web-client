import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
} from 'common/actions/entities/team';
import { fetchMembersRequest } from 'common/actions/entities/member';
import {
  teamsByIdSelector,
  teamListSelector,
  isLoadingSelector,
} from 'common/selectors/entities/team';
import { userDataSelector, userTeamListSelector } from 'common/selectors/user';
import {
  memberListSelector,
  membersByIdSelector,
} from 'common/selectors/entities/member';
import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  teamsById: teamsByIdSelector,
  teams: teamListSelector,
  user: userDataSelector,
  userTeamList: userTeamListSelector,
  members: memberListSelector,
  membersById: membersByIdSelector,
});

const mapDispatchToProps = {
  fetchMembersRequest,
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
