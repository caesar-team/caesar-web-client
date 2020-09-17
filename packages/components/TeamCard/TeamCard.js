/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import memoizeOne from 'memoize-one';
import {
  ROUTES,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Button } from '../Button';
import { AvatarsList } from '../Avatar';
import { Can } from '../Ability';
import { DottedMenu } from '../DottedMenu';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.white};
`;

const TeamWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  cursor: pointer;
`;

const StyledDottedMenu = styled(DottedMenu)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 82px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;
`;

const MenuButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.color.black};
  border: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
    border: none;
  }
`;

const TeamDetails = styled.div`
  display: flex;
  align-items: center;
`;

const TeamIcon = styled.img`
  object-fit: cover;
  width: 80px;
  height: 80px;
  border-radius: 50%;
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
`;

const TeamMembers = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.gray};
`;

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const getMembers = memoizeOne((users, members) =>
  users.reduce((accumulator, { id }) => {
    const member = members.find(user => user.id === id);

    return member ? [...accumulator, member] : accumulator;
  }, []),
);

const TeamCard = ({
  className,
  team,
  members,
  onClick = Function.prototype,
  onClickEditTeam = Function.prototype,
  onClickLeaveTeam = Function.prototype,
  onClickRemoveTeam = Function.prototype,
}) => {
  const { id, icon, users } = team;
  const areMembersAvailable = users && users.length > 0;

  const teamSubject = {
    __typename: PERMISSION_ENTITY.TEAM,
    team_edit: !!team?._links?.team_edit,
    team_delete: !!team?._links?.team_delete,
  };

  return (
    <Wrapper className={className} onClick={onClick}>
      <Can I={PERMISSION.CRUD} a={teamSubject}>
        <StyledDottedMenu
          tooltipProps={{
            textBoxWidth: '100px',
            arrowAlign: 'start',
            position: 'left top',
            padding: '0px 0px',
            flat: true,
            zIndex: '1',
          }}
        >
          <MenuWrapper>
            <Can I={PERMISSION.EDIT} a={teamSubject}>
              <MenuButton color="white" onClick={onClickEditTeam}>
                Edit
              </MenuButton>
            </Can>
            <MenuButton color="white" onClick={onClickLeaveTeam}>
              Leave
            </MenuButton>            
            <Can I={PERMISSION.DELETE} a={teamSubject}>
              <MenuButton color="white" onClick={onClickRemoveTeam}>
                Remove
              </MenuButton>
            </Can>
          </MenuWrapper>
        </StyledDottedMenu>
      </Can>
      <Link
        key={id}
        href={`${ROUTES.SETTINGS}${ROUTES.TEAM}/[id]`}
        as={`${ROUTES.SETTINGS}${ROUTES.TEAM}/${id}`}
      >
        <TeamWrapper>
          <TeamDetails>
            <TeamIcon src={icon} />
            <TeamInfo>
              <TeamName>{getTeamTitle(team)}</TeamName>
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
            size={32}
            fontSize="small"
            avatars={getMembers(users, members)}
            visibleCount={10}
          />
        )}
      </AvatarsWrapper>
    </Wrapper>
  );
};

export default TeamCard;
