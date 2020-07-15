import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Button,
  TeamCard,
  LogoLoader,
  NewTeamModal,
  ConfirmModal,
  Can,
} from '@caesar/components';
import {
  TEAM_TYPE,
  CREATE_PERMISSION,
  ENTITY_TYPE,
} from '@caesar/common/constants';

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.lightBlue};
  width: 100%;
  position: relative;
  height: calc(100vh - 55px);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.lightBlue};
  width: 100%;
  padding: 60px;
  position: relative;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.color.black};
`;

const TeamListWrapper = styled.div`
  display: flex;
  padding: 30px;
  flex-wrap: wrap;

  > {
    &:nth-child(2n + 1) {
      margin-right: 60px;
    }
  }
`;

const TeamCardStyled = styled(TeamCard)`
  width: calc((100% - 60px) / 2);
  margin-bottom: 30px;
  cursor: pointer;
`;

const NEW_TEAM_MODAL = 'newTeamModal';
const REMOVE_TEAM_MODAL = 'removeTeamModal';

class TeamListContainer extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.fetchTeamsRequest();
    this.props.fetchMembersRequest();
  }

  handleCreateSubmit = ({ title, icon }) => {
    this.props.createTeamRequest(title, icon);

    this.handleCloseModal(NEW_TEAM_MODAL)();
  };

  handleOpenModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: true,
      },
    }));
  };

  handleCloseModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: false,
      },
    }));
  };

  handleClickRemoveTeam = teamId => event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(
      {
        selectedTeamId: teamId,
      },
      this.handleOpenModal(REMOVE_TEAM_MODAL),
    );
  };

  handleRemoveTeam = () => {
    this.props.removeTeamRequest(this.state.selectedTeamId);

    this.setState(
      {
        selectedTeamId: null,
      },
      this.handleCloseModal(REMOVE_TEAM_MODAL),
    );
  };

  handleChangeMemberRole = (member, role) => {
    const { selectedTeamId } = this.state;

    this.props.updateTeamMemberRoleRequest(selectedTeamId, member.id, role);
  };

  prepareInitialState() {
    return {
      selectedTeamId: null,
      modalVisibilities: {
        [NEW_TEAM_MODAL]: false,
        [REMOVE_TEAM_MODAL]: false,
      },
    };
  }

  renderTeamCards() {
    const { teams, members } = this.props;

    return teams.map(team => (
      <TeamCardStyled
        key={team.id}
        team={team}
        members={members}
        isRemoveButtonVisible={team.type !== TEAM_TYPE.DEFAULT}
        onClickRemoveTeam={this.handleClickRemoveTeam(team.id)}
      />
    ));
  }

  render() {
    const { isLoading } = this.props;
    const { modalVisibilities } = this.state;

    if (isLoading) {
      return (
        <LogoWrapper>
          <LogoLoader textColor="black" />
        </LogoWrapper>
      );
    }

    const renderedTeamCards = this.renderTeamCards();

    const caslSubject = {
      __typename: 'team',
      // eslint-disable-next-line camelcase
      team_create: !!this.props.user?._links?.team_create,
    };

    return (
      <Wrapper>
        <TopWrapper>
          <Title>Teams</Title>
          <Can I="create" a={caslSubject}>
            <Button
              withOfflineCheck
              onClick={this.handleOpenModal(NEW_TEAM_MODAL)}
              icon="plus"
              color="black"
            >
              Add team
            </Button>
          </Can>
        </TopWrapper>
        <TeamListWrapper>{renderedTeamCards}</TeamListWrapper>
        {modalVisibilities[NEW_TEAM_MODAL] && (
          <NewTeamModal
            onSubmit={this.handleCreateSubmit}
            onCancel={this.handleCloseModal(NEW_TEAM_MODAL)}
          />
        )}
        <ConfirmModal
          isOpened={modalVisibilities[REMOVE_TEAM_MODAL]}
          description="Are you sure you want to remove team?"
          onClickConfirm={this.handleRemoveTeam}
          onClickCancel={this.handleCloseModal(REMOVE_TEAM_MODAL)}
        />
      </Wrapper>
    );
  }
}

export default TeamListContainer;
