import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { TEAM_TYPE, TEAM_TEXT_TYPE } from '@caesar/common/constants';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Scrollbar } from '../Scrollbar';
import { Dropdown } from '../Dropdown';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { TeamsList } from '../TeamsList';
import { AppVersion } from '../AppVersion';
import { Overlay } from '../Modal';
import { MenuListInner } from './components/MenuListInner';

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Box} {
    width: 100%;
    max-height: calc(100vh - 150px);
  }

  ${Dropdown.OptionsList} {
    overflow: auto;
  }
`;

const ColumnHeader = styled.div`
  position: relative;
  z-index: ${({ isDropdownOpened, theme }) =>
    isDropdownOpened && theme.zIndex.dropdown};
  display: flex;
  align-items: center;
  height: 56px;
  flex: 0 0 56px;
  padding: 8px 24px;
  background-color: ${({ bgColor, theme }) =>
    bgColor ? theme.color[bgColor] : theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  margin-left: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
`;

const DropdownIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: auto;
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
`;

const StyledAppVersion = styled(AppVersion)`
  padding: 8px 24px;
  margin-top: auto;
`;

const MenuListComponent = ({ mode, setSearchedText, setMode }) => {
  const currentTeam = useSelector(currentTeamSelector);
  const teamList = useSelector(teamsByIdSelector);
  const [isDropdownOpened, setDropdownOpened] = useState(false);
  const [isListsOpened, setListsOpened] = useState(true);
  const activeTeamId = currentTeam?.id || TEAM_TYPE.PERSONAL;

  const handleToggleDropdown = isOpened => {
    setDropdownOpened(isOpened);
  };

  const getColumnTitle = () =>
    activeTeamId === TEAM_TYPE.PERSONAL
      ? TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL]
      : getTeamTitle(teamList[activeTeamId]);

  const TeamAvatar = ({ team }) =>
    team?.locked ? (
      <Icon name="warning" width={32} height={32} />
    ) : (
      <Avatar
        avatar={team?.icon}
        email={team?.email}
        size={32}
        fontSize="small"
      />
    );

  return (
    <>
      <StyledDropdown
        renderOverlay={handleToggle => (
          <TeamsList
            activeTeamId={activeTeamId}
            handleToggle={handleToggle}
            setListsOpened={setListsOpened}
          />
        )}
        onToggle={handleToggleDropdown}
      >
        <ColumnHeader
          bgColor={isDropdownOpened ? 'white' : 'alto'}
          isDropdownOpened={isDropdownOpened}
        >
          <TeamAvatar team={teamList[activeTeamId]} />
          <ColumnTitle>{getColumnTitle()}</ColumnTitle>
          <DropdownIcon
            name="arrow-triangle"
            width={16}
            height={16}
            isDropdownOpened={isDropdownOpened}
          />
        </ColumnHeader>
      </StyledDropdown>
      <Scrollbar>
        <Menu>
          <MenuListInner
            mode={mode}
            setSearchedText={setSearchedText}
            setMode={setMode}
            isListsOpened={isListsOpened}
            setListsOpened={setListsOpened}
          />
          <StyledAppVersion />
        </Menu>
      </Scrollbar>
      {isDropdownOpened && <Overlay />}
    </>
  );
};

export const MenuList = memo(MenuListComponent);
