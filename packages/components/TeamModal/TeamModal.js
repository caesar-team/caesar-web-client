import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import {
  Modal,
  ModalTitle,
  Input,
  Icon,
  Scrollbar,
  Button,
} from '@caesar/components';
import { RadioGroup } from '../Radio';
import { ActiveTeamRow, RadioTeamRow } from './TeamRow';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
`;

const StyledInput = styled(Input)`
  ${Input.InputField} {
    height: 50px;
    border: 1px solid ${({ theme }) => theme.color.gallery};
    border-radius: 3px;
    padding: 15px 20px 15px 54px;
    font-size: 16px;
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.color.gallery};
`;

const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const RadioGroupStyled = styled(RadioGroup)`
  display: flex;
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

class TeamModal extends Component {
  state = this.prepareInitialState();

  filter = memoize((teamList, filterText) =>
    teamList.filter(({ title }) => title.toLowerCase().includes(filterText)),
  );

  handleChange = event => {
    event.preventDefault();

    this.setState({
      filterText: event.target.value,
    });
  };

  handleChangeTeam = (name, value) => {
    this.setState({
      teamId: value,
    });
  };

  handleSubmit = () => {
    this.props.onChangeTeam(this.state.teamId);
  };

  prepareInitialState() {
    return {
      filterText: '',
      teamId: this.props.teamId,
    };
  }

  renderTeams() {
    const { teamList, teamId: teamIdFromProps } = this.props;
    const { teamId, filterText } = this.state;

    const filteredTeams = this.filter(teamList, filterText);
    const activeTeam = filteredTeams.find(({ id }) => id === teamIdFromProps);

    const options = filteredTeams
      .filter(({ id }) => id !== teamIdFromProps)
      .map(team => ({
        value: team.id,
        label: team.title,
        renderer: RadioTeamRow,
        data: team,
      }));

    return (
      <Fragment>
        {activeTeam && <ActiveTeamRow isActive withWrapper data={activeTeam} />}
        <RadioGroupStyled
          name="teams"
          value={teamId}
          options={options}
          onChange={this.handleChangeTeam}
        />
      </Fragment>
    );
  }

  render() {
    const { onCancel } = this.props;
    const { filterText } = this.state;

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Team</ModalTitle>
        <ModalDescription>Switch teams to sort lists</ModalDescription>
        <StyledInput
          placeholder="Search by teams…"
          value={filterText}
          onChange={this.handleChange}
          prefix={<StyledIcon name="search" width={20} height={20} />}
        />
        <TeamList>
          <Scrollbar autoHeight autoHeightMax={400}>
            {this.renderTeams()}
          </Scrollbar>
        </TeamList>
        <ButtonsWrapper>
          <Button color="black" onClick={this.handleSubmit}>
            SWITCH
          </Button>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

export default TeamModal;
