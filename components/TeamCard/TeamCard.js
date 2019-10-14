import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import memoizeOne from 'memoize-one';
import { Button, AvatarsList, Can } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.white};
`;

const TeamWrapper = styled.div`
  display: flex;
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

const getMembers = memoizeOne((users, members) =>
  users.map(({ id }) => members.find(member => member.id === id)),
);

const TeamCard = ({
  className,
  team,
  members,
  isRemoveButtonVisible = false,
  onClick = Function.prototype,
  onClickRemoveTeam = Function.prototype,
}) => {
  const { id, title, icon, users } = team;
  const areMembersAvailable = users && users.length > 0;

  return (
    <Wrapper className={className} onClick={onClick}>
      <Link key={id} href="/settings/team/[id]" as={`/settings/team/${id}`}>
        <TeamWrapper>
          <TeamDetails>
            <TeamIcon src={icon} />
            <TeamInfo>
              <TeamName>{title}</TeamName>
              {areMembersAvailable && (
                <TeamMembers>{users.length} members</TeamMembers>
              )}
            </TeamInfo>
          </TeamDetails>
        </TeamWrapper>
      </Link>
      <AvatarsWrapper>
        {areMembersAvailable && (
          <AvatarsList
            isSmall
            avatars={getMembers(users, members)}
            visibleCount={20}
          />
        )}
        {isRemoveButtonVisible && (
          <Can I="delete" of={team}>
            <Button color="white" onClick={onClickRemoveTeam}>
              Remove
            </Button>
          </Can>
        )}
      </AvatarsWrapper>
    </Wrapper>
  );
};

export default TeamCard;
