import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { fetchKeyPairRequest } from 'common/actions/user';
import {
  addTeamMembersBatchRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
} from 'common/actions/entities/team';
import { initWorkflow } from 'common/actions/workflow';
import {
  isLoadingSelector,
  teamSelector,
} from 'common/selectors/entities/team';
import { membersByIdSelector } from 'common/selectors/entities/member';
import { userDataSelector } from 'common/selectors/user';
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
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Team),
);
