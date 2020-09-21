import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { fetchKeyPairRequest } from '@caesar/common/actions/user';
import {
  addTeamMembersBatchRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
  removeTeamRequest,
} from '@caesar/common/actions/entities/team';
import { leaveTeamRequest } from '@caesar/common/actions/entities/member';
import { initWorkflow } from '@caesar/common/actions/workflow';
import {
  isLoadingSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { userDataSelector } from '@caesar/common/selectors/user';
import Team from './Team';

const mapStateToProps = (state, { router }) => ({
  isLoading: isLoadingSelector(state),
  team: teamSelector(state, { teamId: router.query.id }),
  membersById: membersByIdSelector(state),
  user: userDataSelector(state),
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
  addTeamMembersBatchRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
  initWorkflow,
  leaveTeamRequest,
  removeTeamRequest,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Team),
);
