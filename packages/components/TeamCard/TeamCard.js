/* eslint-disable camelcase */
import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Link from 'next/link';
import { ROUTES, PERMISSION, TEAM_MESSAGES } from '@caesar/common/constants';
import { teamMembersFullViewSelector } from '@caesar/common/selectors/entities/member';
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
  background-color: ${({ theme }) => theme.color.emperor}!important;
  border-radius: ${({ theme }) => theme.borderRadius};
  right: 30px;
`;

const MenuButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.color.lightGray};
  background-color: transparent;
  border: 0;
  text-transform: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.white};
    border: 0;
  }
`;

const TeamDetails = styled.div`
  display: flex;
  align-items: center;
`;

const TeamIcon = styled.img`
  object-fit: cover;
  width: 80px;
  flex: 0 0 80px;
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
  }
`;

const TeamCardComponent = ({
  className,
  team,
  userId,
  onClick = Function.prototype,
  onClickEditTeam = Function.prototype,
  onClickLeaveTeam = Function.prototype,
  onClickRemoveTeam = Function.prototype,
  onPinTeam = Function.prototype,
}) => {
  const { id, icon, members, pinned, _permissions } = team || {};
  const memberCounter = members?.length || 0;
  const areMembersAvailable = memberCounter > 0;
  const teamMembers = useSelector(state =>
    teamMembersFullViewSelector(state, { teamId: id }),
  );

  const isCurrentUserTeamMember = useMemo(
    () => !!teamMembers.find(member => member.userId === userId),
    [teamMembers],
  );
  const canEditTeam = ability.can(PERMISSION.EDIT, _permissions);
  const canRemoveTeam = ability.can(PERMISSION.DELETE, _permissions);
  const canLeaveTeam =
    ability.can(PERMISSION.LEAVE, _permissions) && isCurrentUserTeamMember;
  const canPinTeam = ability.can(PERMISSION.PIN, _permissions);
  const shouldShowMenu = canLeaveTeam || canEditTeam || canRemoveTeam;

  return (
    <Wrapper className={className} onClick={onClick}>
      {shouldShowMenu && (
        <StyledDottedMenu
          tooltipProps={{
            textBoxWidth: '100px',
            arrowAlign: 'end',
            position: 'bottom right',
            padding: '0px 0px',
            flat: true,
            zIndex: '10',
            border: '0',
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
                  {memberCounter}{' '}
                  {getPlural(memberCounter, ['member', 'members'])}
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
            avatars={teamMembers}
            visibleCount={10}
          />
        )}
      </AvatarsWrapper>
    </Wrapper>
  );
};

export const TeamCard = memo(TeamCardComponent);
