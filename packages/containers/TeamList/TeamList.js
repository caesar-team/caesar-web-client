import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Button,
  TeamCard,
  SettingsWrapper,
  TeamModal,
  CropModal,
  ConfirmModal,
  ConfirmLeaveTeamModal,
  MODAL,
  Can,
  Tabs,
  Tab,
} from '@caesar/components';
import { PERMISSION, PERMISSION_ENTITY } from '@caesar/common/constants';

const TeamListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

const StyledTeamCard = styled(TeamCard)`
  width: calc((100% - 24px) / 2);
  margin-bottom: 24px;
`;

const ALL_TAB_NAME = 'all';
const FAVORITES_TAB_NAME = 'favorites';

class TeamListContainer extends Component {
  state = this.prepareInitialState();

  handleCreateSubmit = ({ title, icon, setSubmitting, setErrors }) => {
    this.props.createTeamRequest({
      title,
      icon,
      handleCloseModal: this.handleCloseModal(MODAL.NEW_TEAM),
      setSubmitting,
      setErrors,
    });
  };

  handleEditSubmit = ({ teamId, title, icon, setSubmitting, setErrors }) => {
    this.props.editTeamRequest({
      teamId,
      title,
      icon,
      handleCloseModal: this.handleCloseModal(MODAL.NEW_TEAM),
      setSubmitting,
      setErrors,
    });
  };

  handleOpenModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      forceClosedMenu: true,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: true,
      },
    }));
  };

  handleCloseModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      forceClosedMenu: false,
      selectedTeamId: null,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: false,
      },
    }));
  };

  handleClickEditTeam = teamId => event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(
      {
        selectedTeamId: teamId,
      },
      this.handleOpenModal(MODAL.NEW_TEAM),
    );
  };

  handleClickRemoveTeam = teamId => event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(
      {
        selectedTeamId: teamId,
      },
      this.handleOpenModal(MODAL.REMOVE_TEAM),
    );
  };

  handleClickLeaveTeam = team => event => {
    event.preventDefault();
    event.stopPropagation();
    const { id, title } = team;

    this.setState(
      {
        selectedTeamId: id,
        selectedTeamTitle: title,
      },
      this.handleOpenModal(MODAL.LEAVE_TEAM),
    );
  };

  handleLeaveTeam = () => {
    this.props.leaveTeamRequest(this.state.selectedTeamId);

    this.setState(
      {
        selectedTeamId: null,
        selectedTeamTitle: null,
      },
      this.handleCloseModal(MODAL.LEAVE_TEAM),
    );
  };

  handleRemoveTeam = () => {
    this.props.removeTeamRequest(this.state.selectedTeamId);

    this.setState(
      {
        selectedTeamId: null,
      },
      this.handleCloseModal(MODAL.REMOVE_TEAM),
    );
  };

  handleChangeMemberRole = (member, role) => {
    // TODO: Need to implement UI. Use member.id instead of userId
    this.props.updateTeamMemberRoleRequest(member.id, role);
  };

  handlePinTeam = (teamId, isPinned) => event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.togglePinTeamRequest(teamId, !isPinned);
  };

  handleChangeTab = (name, tabName) => {
    this.setState({
      activeTabName: tabName,
    });
  };

  prepareInitialState() {
    return {
      selectedTeamId: null,
      selectedTeamTitle: null,
      modalVisibilities: {
        [MODAL.NEW_TEAM]: false,
        [MODAL.LEAVE_TEAM]: false,
        [MODAL.REMOVE_TEAM]: false,
        [MODAL.CROP_IMAGE]: false,
      },
      activeTabName: ALL_TAB_NAME,
      forceClosedMenu: false,
    };
  }

  renderTeamCards(teams) {
    const { forceClosedMenu } = this.state;
    const { currentUser } = this.props;

    if (!teams || teams.length === 0) {
      return <div>No teams</div>;
    }

    return teams.map(team => (
      <StyledTeamCard
        key={team.id}
        team={team}
        userId={currentUser.id}
        forceClosedMenu={forceClosedMenu}
        onClickEditTeam={this.handleClickEditTeam(team.id)}
        onClickLeaveTeam={this.handleClickLeaveTeam(team)}
        onClickRemoveTeam={this.handleClickRemoveTeam(team.id)}
        onPinTeam={this.handlePinTeam(team.id, team.pinned)}
      />
    ));
  }

  render() {
    const {
      isLoading,
      isLoadingTeams,
      teams,
      userTeamList,
      isDomainAdmin,
      isDomainManager,
      currentUser,
    } = this.props;

    const { modalVisibilities, selectedTeamTitle, activeTabName } = this.state;
    const favoriteTeams = isDomainAdmin
      ? teams.filter(team => team.pinned)
      : userTeamList;
    const isDomainAdminOrManager = isDomainAdmin || isDomainManager;
    const allTeamCards = this.renderTeamCards(
      isDomainAdminOrManager ? teams : userTeamList,
    );
    const favoriteTeamCards = this.renderTeamCards(favoriteTeams);

    const teamSubject = {
      ...currentUser?._permissions,
      __typename: PERMISSION_ENTITY.TEAM,
    };

    const teamsLength =
      // eslint-disable-next-line no-nested-ternary
      activeTabName === FAVORITES_TAB_NAME
        ? favoriteTeams.length
        : isDomainAdminOrManager
        ? teams.length
        : userTeamList.length;

    const tabName = isDomainAdmin ? 'Favorites' : 'My Teams';

    return (
      <SettingsWrapper
        isLoading={isLoading || isLoadingTeams}
        title={`Teams (${teamsLength})`}
        addonTopComponent={
          <Can I={PERMISSION.CREATE} a={teamSubject}>
            <Button
              withOfflineCheck
              onClick={this.handleOpenModal(MODAL.NEW_TEAM)}
              icon="plus"
              color="black"
            >
              Add a team
            </Button>
          </Can>
        }
      >
        {isDomainAdminOrManager ? (
          <Tabs activeTabName={activeTabName} onChange={this.handleChangeTab}>
            <Tab title="All" name={ALL_TAB_NAME}>
              <TeamListWrapper>{allTeamCards}</TeamListWrapper>
            </Tab>
            <Tab title={tabName} name={FAVORITES_TAB_NAME}>
              <TeamListWrapper>{favoriteTeamCards}</TeamListWrapper>
            </Tab>
          </Tabs>
        ) : (
          <TeamListWrapper>{allTeamCards}</TeamListWrapper>
        )}
        {modalVisibilities[MODAL.NEW_TEAM] && (
          <TeamModal
            teamId={this.state.selectedTeamId}
            teams={teams}
            onCreateSubmit={this.handleCreateSubmit}
            onEditSubmit={this.handleEditSubmit}
            onCancel={this.handleCloseModal(MODAL.NEW_TEAM)}
          />
        )}
        {modalVisibilities[MODAL.CROP_IMAGE] && (
          <CropModal onCancel={this.handleCloseModal(MODAL.CROP_IMAGE)} />
        )}
        <ConfirmModal
          isOpened={modalVisibilities[MODAL.REMOVE_TEAM]}
          description="Are you sure you want to remove team?"
          onClickConfirm={this.handleRemoveTeam}
          onClickCancel={this.handleCloseModal(MODAL.REMOVE_TEAM)}
        />
        <ConfirmLeaveTeamModal
          isOpened={modalVisibilities[MODAL.LEAVE_TEAM]}
          teamTitle={selectedTeamTitle}
          onClickConfirm={this.handleLeaveTeam}
          onClickCancel={this.handleCloseModal(MODAL.LEAVE_TEAM)}
        />
      </SettingsWrapper>
    );
  }
}

export { TeamListContainer as TeamList };
