import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchKeyPairRequest } from '@caesar/common/actions/user';
import {
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
} from '@caesar/common/actions/entities/team';
import { fetchMembersRequest } from '@caesar/common/actions/entities/member';
import {
  teamsByIdSelector,
  teamListSelector,
  isLoadingSelector,
} from '@caesar/common/selectors/entities/team';
import {
  userDataSelector,
  userTeamListSelector,
} from '@caesar/common/selectors/user';
import {
  memberListSelector,
  membersByIdSelector,
} from '@caesar/common/selectors/entities/member';
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
  fetchKeyPairRequest,
  fetchMembersRequest,
  fetchTeamsRequest,
  createTeamRequest,
  removeTeamRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
