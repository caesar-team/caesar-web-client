import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { Modal, ModalTitle, UserSearchInput } from '@caesar/components';
import { generateTeamTag } from '@caesar/common/utils/team';
import { TeamTag } from '../TeamTag';
import { Section } from '../Section';
import { TextWithLines } from '../TextWithLines';
import { Carousel } from '../Carousel';
import { MemberList } from '../MemberList';
import { Button } from '../Button';
import { INVITED_SECTION } from './constants';
import { AnonymousLink } from './components';
import { getAnonymousLink } from './utils';

const Wrapper = styled.div`
  position: relative;
`;

const TextWithLinesStyled = styled(TextWithLines)`
  font-size: 14px;
  font-weight: normal;
  color: ${({ theme }) => theme.color.emperor};
`;

const TextWithLinesAbsolute = styled(TextWithLinesStyled)`
  position: absolute;
`;

const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const CarouselStyled = styled(Carousel)`
  ${Carousel.ArrowsWrapper} {
    background-color: ${({ theme }) => theme.color.white};
    width: 55px;
    top: 4px;

    > *:first-child {
      margin-left: 20px;
    }
  }
`;

const TeamTagStyled = styled(TeamTag)`
  margin-right: 20px;

  ${({ isActive, theme }) =>
    isActive &&
    `
    border: 1px solid ${theme.color.gray};
  `};

  &:last-of-type {
    margin-right: 0;
  }
`;

const SectionStyled = styled(Section)`
  margin-bottom: 30px;

  ${Section.Name} {
    font-size: 14px;
    color: ${({ theme }) => theme.color.emperor};
  }
`;

const MemberListStyled = styled(MemberList)`
  margin-bottom: 30px;
  margin-top: 10px;

  ${MemberList.Member} {
    background-color: ${({ theme }) => theme.color.lightBlue};
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

class ShareModal extends Component {
  state = this.prepareInitialState();

  componentDidUpdate(prevProps) {
    const shouldUpdateLoading =
      getAnonymousLink(prevProps.anonymousLink) !==
      getAnonymousLink(this.props.anonymousLink);

    if (shouldUpdateLoading) {
      // eslint-disable-next-line
      this.setState({
        isGeneratingLink: false,
      });
    }
  }

  handleToggleSection = sectionName => () => {
    this.setState(prevState => ({
      ...prevState,
      openedSections: prevState.openedSections.includes(sectionName)
        ? prevState.openedSections.filter(name => name !== sectionName)
        : [...prevState.openedSections, sectionName],
    }));
  };

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

  handleToggleTeam = teamId => () => {
    this.setState(prevState => ({
      ...prevState,
      teamIds: prevState.teamIds.includes(teamId)
        ? prevState.teamIds.filter(id => id !== teamId)
        : [...prevState.teamIds, teamId],
    }));
  };

  handleToggleAnonymousLink = () => {
    const { anonymousLink, onActivateLink, onDeactivateLink } = this.props;

    const link = getAnonymousLink(anonymousLink);
    const action = link ? onDeactivateLink : onActivateLink;

    this.setState(
      {
        isGeneratingLink: !link,
      },
      action,
    );
  };

  handleUpdateAnonymousLink = async () => {
    this.setState(
      {
        isGeneratingLink: true,
      },
      this.props.onActivateLink,
    );
  };

  handleCopy = () => {
    const { notification, anonymousLink = [] } = this.props;

    copy(getAnonymousLink(anonymousLink));

    notification.show({
      text: `The shared link has been copied.`,
    });
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
      isGeneratingLink: false,
    };
  }

  renderTeamTags() {
    const { teamIds } = this.state;
    const { teams } = this.props;

    const renderedTeams = teams.map(({ id, title, ...props }) => {
      const isActive = teamIds.includes(id);

      return (
        <TeamTagStyled
          isActive={isActive}
          key={id}
          name={generateTeamTag(title)}
          onClick={this.handleToggleTeam(id)}
          {...props}
        />
      );
    });

    return <CarouselStyled>{renderedTeams}</CarouselStyled>;
  }

  render() {
    const {
      teams,
      sharedMembers,
      anonymousLink,
      withAnonymousLink,
      onCancel,
    } = this.props;
    const { openedSections, members, isGeneratingLink } = this.state;

    const shouldShowTeamsSection = teams.length > 0;
    const shouldShowAddedMembers = members.length > 0;
    const shouldShowSharedMembers = sharedMembers.length > 0;

    const renderedTeamTags = this.renderTeamTags();

    const searchedBlackListMemberIds = [
      ...members.map(({ id }) => id),
      ...sharedMembers.map(({ id }) => id),
    ];

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
          <UserSearchInput
            blackList={searchedBlackListMemberIds}
            onClickAdd={this.handleAddMember}
          />
          {shouldShowAddedMembers && (
            <Fragment>
              <TextWithLinesStyled position="left" width={1}>
                Personal
              </TextWithLinesStyled>
              <MemberListStyled
                maxHeight={200}
                members={members}
                controlType="remove"
                onClickRemove={this.handleRemoveMember}
              />
            </Fragment>
          )}
          {shouldShowTeamsSection && (
            <Fragment>
              <TextWithLinesAbsolute position="left" width={1}>
                Teams ({teams.length})
              </TextWithLinesAbsolute>
              <TeamsWrapper>{renderedTeamTags}</TeamsWrapper>
            </Fragment>
          )}
          {shouldShowSharedMembers && (
            <SectionStyled
              name={INVITED_SECTION}
              isOpened={openedSections.includes(INVITED_SECTION)}
              onToggleSection={this.handleToggleSection(INVITED_SECTION)}
            >
              <MemberList members={sharedMembers} />
            </SectionStyled>
          )}
          {withAnonymousLink && (
            <AnonymousLink
              link={anonymousLink}
              isLoading={isGeneratingLink}
              onToggle={this.handleToggleAnonymousLink}
              onCopy={this.handleCopy}
              onUpdate={this.handleUpdateAnonymousLink}
            />
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

export default ShareModal;
