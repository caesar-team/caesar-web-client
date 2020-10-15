import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchKeyPairRequest } from '@caesar/common/actions/user';
import {
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
  isLoadingTeamsSelector,
  teamsByIdSelector,
  teamSortedListSelector,
} from '@caesar/common/selectors/entities/team';
import {
  userDataSelector,
  userTeamListSelector,
} from '@caesar/common/selectors/user';
import {
  memberListSelector,
  membersByIdSelector,
} from '@caesar/common/selectors/entities/member';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { TeamList } from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  isLoadingTeams: isLoadingTeamsSelector,
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
  createTeamRequest,
  editTeamRequest,
  leaveTeamRequest,
  removeTeamRequest,
  togglePinTeamRequest,
};

export const TeamListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamList);
