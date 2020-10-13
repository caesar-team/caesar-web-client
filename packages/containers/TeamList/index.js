import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchKeyPairRequest } from '@caesar/common/actions/user';
import {
  fetchTeamsRequest,
  createTeamRequest,
  editTeamRequest,
  removeTeamRequest,
  togglePinTeamRequest,
} from '@caesar/common/actions/entities/team';
import {
  fetchMembersRequest,
  leaveTeamRequest,
} from '@caesar/common/actions/entities/member';
import {
  teamsByIdSelector,
  teamSortedListSelector,
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
import { initWorkflow } from '@caesar/common/actions/workflow';
import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  teamsById: teamsByIdSelector,
  teams: teamSortedListSelector,
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
  editTeamRequest,
  leaveTeamRequest,
  removeTeamRequest,
  initWorkflow,
  togglePinTeamRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
