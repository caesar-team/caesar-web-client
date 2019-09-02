import React from 'react';
import styled from 'styled-components';
import { Button, AvatarsList } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.white};
`;

const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.lightBlue};
`;

const TeamDetails = styled.div`
  display: flex;
  align-items: center;
`;

const TeamIcon = styled.img`
  object-fit: cover;
  width: 80px;
  height: 80px;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const TeamName = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  letter-spacing: 0.6px;
`;

const TeamMembers = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const avatars = [
  { id: 1, name: 'Dmitry Spiridonov', email: 'dspiridonov@4xxi.com' },
  { id: 2, name: 'Dmitry Spiridonov', email: 'dspiridonov@4xxi.com' },
];

const TeamCard = ({ ...props }) => {
  return (
    <Wrapper {...props}>
      <TeamWrapper>
        <TeamDetails>
          <TeamIcon />
          <TeamInfo>
            <TeamName>Babies</TeamName>
            <TeamMembers>44 members</TeamMembers>
          </TeamInfo>
        </TeamDetails>
      </TeamWrapper>
      <AvatarsWrapper>
        <AvatarsList isSmall avatars={avatars} visibleCount={20} />
        <Button color="white" icon="plus" />
      </AvatarsWrapper>
    </Wrapper>
  );
};

export default TeamCard;
