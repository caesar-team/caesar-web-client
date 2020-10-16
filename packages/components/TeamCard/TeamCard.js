/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import memoizeOne from 'memoize-one';
import { ROUTES, PERMISSION, TEAM_MESSAGES } from '@caesar/common/constants';
import { ability } from '@caesar/common/ability';
import { getPlural } from '@caesar/common/utils/string';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Button } from '../Button';
import { AvatarsList } from '../Avatar';
import { DottedMenu } from '../DottedMenu';
import { Toggle } from '../Toggle';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius};
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
  min-height: 42px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
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
  margin-right: 44px;
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

const Tooltip = styled.div`
  display: none;
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.font.size.xs};
  white-space: nowrap;
  z-index: ${({ theme }) => theme.zIndex.basic};
  transform: translate(-50%, 0);
`;

const ToggleWrapper = styled.div`
  position: absolute;
  top: 44px;
  right: 20px;

  &:hover {
    ${Tooltip} {
      display: flex;
    }  
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
  onPinTeam = Function.prototype,
}) => {
  const { id, icon, users, pinned } = team;
  const areMembersAvailable = users && users.length > 0;

  const { _permissions } = team || {};

  const canEditTeam = ability.can(PERMISSION.EDIT, _permissions);
  const canRemoveTeam = ability.can(PERMISSION.DELETE, _permissions);
  const canLeaveTeam = ability.can(PERMISSION.LEAVE, _permissions);
  const canPinTeam = ability.can(PERMISSION.PIN, _permissions);
  const shouldShowMenu = canLeaveTeam || canEditTeam || canRemoveTeam;

  return (
    <Wrapper className={className} onClick={onClick}>
      {shouldShowMenu && (
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
            {canEditTeam && (
              <MenuButton color="white" onClick={onClickEditTeam}>
                Edit
              </MenuButton>
            )}
            {canLeaveTeam && (
              <MenuButton color="white" onClick={onClickLeaveTeam}>
                Leave
              </MenuButton>
            )}
            {canRemoveTeam && (
              <MenuButton color="white" onClick={onClickRemoveTeam}>
                Remove
              </MenuButton>
            )}
          </MenuWrapper>
        </StyledDottedMenu>
      )}
      {canPinTeam && (
        <ToggleWrapper>
          <Toggle onChange={onPinTeam} checked={pinned} />
          <Tooltip>{TEAM_MESSAGES.PIN}</Tooltip>
        </ToggleWrapper>
      )}
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
                <TeamMembers>
                  {users.length}{' '}
                  {getPlural(users.length, ['member', 'members'])}
                </TeamMembers>
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
