import React from 'react';
import styled from 'styled-components';
import { TextWithLines } from '../../TextWithLines';
import { Carousel } from '../../Carousel';
import { Team } from './Team';

const StyledTextWithLines = styled(TextWithLines)`
  margin-bottom: 8px;
`;

const StyledCarousel = styled(Carousel)`
  ${Carousel.ArrowsWrapper} {
    top: -26px;
    width: 64px;
    padding-left: 16px;
    background-color: ${({ theme }) => theme.color.white};
  }
`;

const StyledTeam = styled(Team)`
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

export const TeamList = ({ teams, teamIds, setTeamIds }) => {
  const handleclickTeam = teamId =>
    setTeamIds(
      teamIds.includes(teamId)
        ? teamIds.filter(id => id !== teamId)
        : [...teamIds, teamId],
    );

  return (
    <>
      <StyledTextWithLines position="left" width={1}>
        Teams ({teams.length})
      </StyledTextWithLines>
      <StyledCarousel>
        {teams.map(team => (
          <StyledTeam
            key={team.id}
            team={team}
            isActive={teamIds.includes(team.id)}
            onClick={() => handleclickTeam(team.id)}
          />
        ))}
      </StyledCarousel>
    </>
  );
};
