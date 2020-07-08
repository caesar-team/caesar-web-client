import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  APP_VERSION,
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
} from '@caesar/common/constants';
import {
  userDataSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { Scrollbar } from '../Scrollbar';
import { Dropdown } from '../Dropdown';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { TeamsList } from '../TeamsList';
import { Overlay } from '../Modal';
import { MenuListInner } from './components/MenuListInner';

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Box} {
    width: 100%;
  }
`;

const ColumnHeader = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  display: flex;
  align-items: center;
  height: 56px;
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
  margin-left: auto;
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppVersion = styled.div`
  padding: 8px 24px;
  margin-top: auto;
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.xs};
  color: ${({ theme }) => theme.color.gray};
`;

const MenuListComponent = ({ mode, setSearchedText, setMode }) => {
  const currentTeam = useSelector(currentTeamSelector);
  const user = useSelector(userDataSelector);
  const teamList = useSelector(teamsByIdSelector);
  const [isDropdownOpened, setDropdownOpened] = useState(false);
  const [isListsOpened, setListsOpened] = useState(true);
  const activeTeamId = currentTeam?.id || TEAM_TYPE.PERSONAL;

  const handleToggleDropdown = isOpened => {
    setDropdownOpened(isOpened);
  };

  const getColumnTitle = () => {
    switch (true) {
      case activeTeamId === TEAM_TYPE.PERSONAL:
        return TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];
      case teamList[activeTeamId].title.toLowerCase() === TEAM_TYPE.DEFAULT:
        return TEAM_TEXT_TYPE[TEAM_TYPE.DEFAULT];
      default:
        return teamList[activeTeamId].title;
    }
  };

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
        <ColumnHeader bgColor={isDropdownOpened ? 'white' : 'alto'}>
          <Avatar avatar={teamList[activeTeamId]?.icon} {...user} isSmall />
          <ColumnTitle>{getColumnTitle()}</ColumnTitle>
          <DropdownIcon
            name="arrow-triangle"
            width={12}
            height={12}
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
          <AppVersion>{APP_VERSION}</AppVersion>
        </Menu>
      </Scrollbar>
      {isDropdownOpened && <Overlay />}
    </>
  );
};

export const MenuList = memo(MenuListComponent);
