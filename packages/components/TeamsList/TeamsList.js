import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { sortByName } from '@caesar/common/utils/utils';
import { TEAM_TYPE } from '@caesar/common/constants';
import {
  userDataSelector,
  userTeamListSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import { setCurrentTeamId } from '@caesar/common/actions/user';
import { getTeamTitle } from '@caesar/common/utils/team';
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

const TeamsListComponent = ({ activeTeamId, handleToggle, setListsOpened }) => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const currentTeam = useSelector(currentTeamSelector);
  const teamList = useSelector(userTeamListSelector).sort((a, b) => {
    if (a.title.toLowerCase() === TEAM_TYPE.DEFAULT) return 1;
    if (b.title.toLowerCase() === TEAM_TYPE.DEFAULT) return -1;

    return sortByName(a.title, b.title);
  });

  const handleChangeTeam = teamId => {
    handleToggle();
    setListsOpened(true);

    if (currentTeam?.id !== teamId) {
      dispatch(setCurrentTeamId(teamId));
    }
  };

  return (
    <>
      {activeTeamId !== TEAM_TYPE.PERSONAL && (
        <Option
          onClick={() => {
            handleChangeTeam(TEAM_TYPE.PERSONAL);
          }}
        >
          <StyledAvatar {...user} size={32} fontSize="small" />
          Personal
        </Option>
      )}
      {teamList.map(team => {
        return activeTeamId === team?.id || !team?.id ? null : (
          <Option
            key={team.id}
            onClick={() => {
              handleChangeTeam(team.id);
            }}
          >
            <StyledAvatar avatar={team.icon} size={32} fontSize="small" />
            {getTeamTitle(team)}
          </Option>
        );
      })}
    </>
  );
};

export const TeamsList = memo(TeamsListComponent);
