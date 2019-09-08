import React, { Component } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { Modal, ModalTitle, Checkbox, Toggle, TagsInput } from 'components';
import { base64ToObject, objectToBase64 } from 'common/utils/cipherUtils';
import { waitIdle } from 'common/utils/utils';
import { generateTeamTag } from 'common/utils/team';
import { KEY_CODES } from 'common/constants';
import { TeamTag } from '../TeamTag';
import { Section } from '../Section';
import { TextWithLines } from '../TextWithLines';
import { Carousel } from '../Carousel';
import { MemberList } from '../MemberList';
import { Button } from '../Button';
import { INVITED_SECTION, WAITING_SECTION } from './constants';
import { MemberSearchInput, AnonymousLink } from './components';

const Wrapper = styled.div`
  position: relative;
`;

const TextWithLinesStyled = styled(TextWithLines)`
  position: absolute;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.emperor};
`;

const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const CarouselStyled = styled(Carousel)`
  ${Carousel.ArrowsWrapper} {
    background-color: ${({ theme }) => theme.white};
    width: 55px;
    top: 4px;

    > *:first-child {
      margin-left: 20px;
    }
  }
`;

const TeamTagStyled = styled(TeamTag)`
  margin-right: 20px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const SectionStyled = styled(Section)`
  margin-bottom: 30px;

  ${Section.Name} {
    font-size: 14px;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.emperor};
  }
`;

const MemberListStyled = styled(MemberList)`
  margin-bottom: 30px;

  ${MemberList.Member} {
    background-color: ${({ theme }) => theme.lightBlue};
    margin-bottom: 4px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 40px;
`;

const ButtonStyled = styled(Button)`
  margin-right: 20px;
`;

export class ShareModal extends Component {
  state = this.prepareInitialState();

  handleAddMember = member => {
    this.setState(prevState => ({
      ...prevState,
      members: [...prevState.members, member],
    }));
  };

  handleRemoveMember = member => () => {
    this.setState(prevState => ({
      ...prevState,
      members: prevState.members.filter(({ id }) => id !== member.id),
    }));
  };

  handleClickTeam = teamId => () => {
    this.setState(prevState => ({
      ...prevState,
      teamsIds: [...prevState.teamIds, teamId],
    }));
  };

  handleClickDone = () => {
    const { onShare } = this.props;
    const { members, teamIds } = this.state;

    onShare(members, teamIds);
  };

  prepareInitialState() {
    return {
      members: [],
      teamIds: [],
      openedSections: [],
    };
  }

  renderTeamTags() {
    const { teams } = this.props;

    const renderedTeams = teams.map(({ id, title, ...props }) => (
      <TeamTagStyled
        key={id}
        name={generateTeamTag(title)}
        onClick={this.handleClickTeam(id)}
        {...props}
      />
    ));

    return <CarouselStyled>{renderedTeams}</CarouselStyled>;
  }

  render() {
    const { teams, shares, onCancel } = this.props;
    const { members } = this.state;

    const shouldShowAddedMembers = members.length > 0;
    const shouldShowSharedMembers = shares.length > 0;

    const renderedTeamTags = this.renderTeamTags();

    const searchedBlackListMemberIds = members.map(({ id }) => id);

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <Wrapper>
          <ModalTitle>Share</ModalTitle>
          <MemberSearchInput
            blackList={searchedBlackListMemberIds}
            onClickAdd={this.handleAddMember}
          />
          {shouldShowAddedMembers && (
            <MemberListStyled
              maxHeight={200}
              members={members}
              controlType="remove"
              onClickRemove={this.handleRemoveMember}
            />
          )}
          <TextWithLinesStyled position="left" width={1}>
            Teams ({teams.length})
          </TextWithLinesStyled>
          <TeamsWrapper>{renderedTeamTags}</TeamsWrapper>
          {shouldShowSharedMembers && (
            <SectionStyled name={INVITED_SECTION}>
              <MemberList members={[]} />
            </SectionStyled>
          )}
          <ButtonsWrapper>
            <ButtonStyled color="white" onClick={onCancel}>
              CANCEL
            </ButtonStyled>
            <Button onClick={this.handleClickDone}>DONE</Button>
          </ButtonsWrapper>
        </Wrapper>
      </Modal>
    );
  }
}
