import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  userDataSelector,
  userTeamListSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import { setCurrentTeamId } from '@caesar/common/actions/user';
import { Avatar } from '../Avatar';

const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 24px;
  font-size: 16px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
    border-top-color: ${({ theme }) => theme.color.gallery};
    border-bottom-color: ${({ theme }) => theme.color.gallery};
  }
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const TeamsListComponent = ({ activeTeamId, handleToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const teamList = useSelector(userTeamListSelector);
  const currentTeam = useSelector(currentTeamSelector);

  const handleChangeTeamId = teamId => {
    if (!currentTeam || currentTeam.id !== teamId) {
      dispatch(setCurrentTeamId(teamId));
    }
  };

  return (
    <>
      {activeTeamId && (
        <Option
          onClick={() => {
            handleToggle('');
          }}
        >
          <StyledAvatar {...user} isSmall />
          Personal
        </Option>
      )}
      {teamList.map(team => {
        return activeTeamId === team.id ? null : (
          <Option
            key={team.id}
            onClick={() => {
              handleToggle(team.id);
              handleChangeTeamId(team.id);
            }}
          >
            <StyledAvatar avatar={team.icon} isSmall />
            {team.title}
          </Option>
        );
      })}
    </>
  );
};

export const TeamsList = memo(TeamsListComponent);
