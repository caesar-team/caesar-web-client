import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import {
  fetchTeamRequest,
  addTeamMemberRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
} from 'common/actions/entities/team';
import { fetchTeamMembersRequest } from 'common/actions/entities/member';
import { isLoadingSelector, teamSelector } from 'common/selectors/entities/team';
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
  fetchTeamRequest,
  addTeamMemberRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
  fetchTeamMembersRequest,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Team),
);
