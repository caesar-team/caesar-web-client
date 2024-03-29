import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { sortByName } from '@caesar/common/utils/sort';
import { DASHBOARD_MODE, TEAM_TYPE } from '@caesar/common/constants';
import {
  currentUserVaultListSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/currentUser';
import {
  setWorkInProgressItem,
  setWorkInProgressListId,
} from '@caesar/common/actions/workflow';
import { setCurrentTeamId } from '@caesar/common/actions/currentUser';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';

const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 24px;
  font-size: 16px;
  line-height: ${({ theme }) => theme.font.lineHeight.big};
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  word-break: break-word;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
    border-top-color: ${({ theme }) => theme.color.gallery};
    border-bottom-color: ${({ theme }) => theme.color.gallery};
  }

  ${({ isDisabled, theme }) =>
    isDisabled &&
    `
    color: ${theme.color.lightGray};
    pointer-events: none;
  `}
`;

const DisabledOption = styled(Option)`
  pointer-events: none;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
`;
const StyledWarningIcon = styled(Icon)`
  margin-right: 16px;
`;
const sortTeams = (a, b) => {
  if (a.title.toLowerCase() === TEAM_TYPE.PERSONAL) return -1;
  if (b.title.toLowerCase() === TEAM_TYPE.PERSONAL) return 1;

  if (a.title.toLowerCase() === TEAM_TYPE.DEFAULT) return 1;
  if (b.title.toLowerCase() === TEAM_TYPE.DEFAULT) return -1;

  return sortByName(a.title, b.title);
};
const isTeamEnable = activeTeamId => team => {
  if (!team?.id) return false;
  // Don't show the active team
  const isNonActiveTeam = team?.id !== activeTeamId;
  // Always show the must and pinned teams
  const isMustTeam = team?.id === TEAM_TYPE.PERSONAL;
  const isPinnedTeam = !!team?.pinned;

  return (isPinnedTeam || isMustTeam) && isNonActiveTeam;
};

const VaultAvatar = ({ vault }) =>
  vault?.locked ? (
    <StyledWarningIcon name="warning" width={32} height={32} />
  ) : (
    <StyledAvatar
      avatar={vault.icon}
      email={vault.email}
      size={32}
      fontSize="small"
    />
  );

const VaultListComponent = ({
  activeTeamId,
  handleToggle,
  setListsOpened,
  setSearchedText,
  setMode, 
}) => {
  const dispatch = useDispatch();
  const currentTeam = useSelector(currentTeamSelector);

  const vaultList = useSelector(currentUserVaultListSelector)
    .filter(isTeamEnable(activeTeamId))
    .sort(sortTeams);

  const handleChangeTeam = teamId => {
    handleToggle();
    setListsOpened(true);

    if (currentTeam?.id !== teamId) {

      dispatch(setWorkInProgressItem(null));
      dispatch(setWorkInProgressListId(null));
      dispatch(setCurrentTeamId(teamId));

      setMode(DASHBOARD_MODE.DEFAULT);
      setSearchedText('');
    }
  };

  return vaultList.length ? (
    vaultList.map(vault => {
      return (
        <Option
          key={vault.id}
          onClick={() => {
            handleChangeTeam(vault.id);
          }}
          isDisabled={vault.locked}
        >
          <VaultAvatar vault={vault} />
          {getTeamTitle(vault)}
        </Option>
      );
    })
  ) : (
    <DisabledOption>No team vaults available</DisabledOption>
  );
};

export const VaultList = memo(VaultListComponent);
