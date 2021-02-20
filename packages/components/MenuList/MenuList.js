import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { TEAM_TYPE } from '@caesar/common/constants';
import { currentTeamSelector } from '@caesar/common/selectors/currentUser';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Scrollbar } from '../Scrollbar';
import { Dropdown } from '../Dropdown';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { VaultList } from '../VaultList';
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
  text-align: left;
  color: ${({ isDarkMode, theme }) =>
    isDarkMode ? theme.color.white : theme.color.black};  
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

const MenuListComponent = ({
  mode,
  setSearchedText,
  setMode,
  isDarkMode = false,
  closeMobileMenu,
}) => {
  const selectedVault =
    useSelector(currentTeamSelector) ||
    useSelector(teamSelector, { teamId: TEAM_TYPE.PERSONAL });

  const [isDropdownOpened, setDropdownOpened] = useState(false);
  const [isListsOpened, setListsOpened] = useState(true);
  const activeTeamId = selectedVault?.id;
  const columnHeaderWhiteColor = isDropdownOpened ? 'white' : 'alto';

  const handleToggleDropdown = isOpened => {
    setDropdownOpened(isOpened);
  };

  return (
    <>
      <StyledDropdown
        renderOverlay={handleToggle => (
          <VaultList
            activeTeamId={activeTeamId}
            handleToggle={handleToggle}
            setListsOpened={setListsOpened}
            setSearchedText={setSearchedText}
            setMode={setMode}
          />
        )}
        onToggle={handleToggleDropdown}
      >
        <ColumnHeader
          bgColor={isDarkMode ? 'emperor' : columnHeaderWhiteColor}
          isDropdownOpened={isDropdownOpened}
        >
          <TeamAvatar team={selectedVault} />
          <ColumnTitle isDarkMode={isDarkMode}>
            {getTeamTitle(selectedVault)}
          </ColumnTitle>
          <DropdownIcon
            name="arrow-triangle"
            width={16}
            height={16}
            color={isDarkMode ? 'white' : 'black'}
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
            isDarkMode={isDarkMode}
            setListsOpened={setListsOpened}
            closeMobileMenu={closeMobileMenu}
          />
          <StyledAppVersion />
        </Menu>
      </Scrollbar>
      {isDropdownOpened && <Overlay />}
    </>
  );
};

export const MenuList = memo(MenuListComponent);
