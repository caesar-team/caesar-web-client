import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchKeyPairRequest } from '@caesar/common/actions/currentUser';
import {
  createTeamRequest,
  editTeamRequest,
  removeTeamRequest,
  togglePinTeamRequest,
} from '@caesar/common/actions/entities/team';
import { leaveTeamRequest } from '@caesar/common/actions/entities/member';
import {
  isLoadingTeamsSelector,
  teamSortedListSelector,
} from '@caesar/common/selectors/entities/team';
import {
  currentUserDataSelector,
  currentUserTeamListSelector,
  isUserDomainAdminSelector,
  isUserDomainAdminOrManagerSelector,
} from '@caesar/common/selectors/currentUser';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { TeamList } from './TeamList';

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector,
  isLoadingTeams: isLoadingTeamsSelector,
  teams: teamSortedListSelector,
  currentUser: currentUserDataSelector,
  userTeamList: currentUserTeamListSelector,
  isDomainAdmin: isUserDomainAdminSelector,
  isDomainAdminOrManager: isUserDomainAdminOrManagerSelector,
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
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
