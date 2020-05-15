import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { generateTeamTag } from '@caesar/common/utils/team';
import { Scrollbar } from '../Scrollbar';
import { Dropdown } from '../Dropdown';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { TeamsList } from '../TeamsList';
import { Overlay } from '../Modal';
import MenuSection from './MenuSection';
import { MenuItemWrapper, MenuItem } from './components';

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Box} {
    width: 100%;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.snow};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  margin-left: 16px;
  font-size: 16px;
  letter-spacing: 0.6px;
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
  margin: 16px 30px 0 60px;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

const MenuListComponent = ({
  mode,
  team,
  inbox,
  favorites,
  trash,
  personalLists,
  teamLists,
  activeListId,
  onClickMenuItem,
  onClickSecureMessage,
}) => {
  const user = useSelector(userDataSelector);
  const teamList = useSelector(teamsByIdSelector);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [openedSectionNames, setOpenedSectionNames] = useState([
    'personal',
    'tools',
  ]);
  const [activeTeamId, setActiveTeamId] = useState('');

  const handleToggleDropdown = isOpened => {
    setIsDropdownOpened(isOpened);
  };

  const handleToggleSection = name => () => {
    const newState = openedSectionNames.includes(name)
      ? openedSectionNames.filter(sectionName => sectionName !== name)
      : openedSectionNames.concat(name);

    setOpenedSectionNames(newState);
  };

  return (
    <>
      <StyledDropdown
        renderOverlay={handleToggle => (
          <TeamsList
            activeTeamId={activeTeamId}
            handleToggle={id => {
              setActiveTeamId(id);
              handleToggle();
            }}
          />
        )}
        onToggle={handleToggleDropdown}
      >
        <ColumnHeader>
          <Avatar avatar={teamList[activeTeamId]?.icon} {...user} isSmall />
          <ColumnTitle>
            {activeTeamId ? teamList[activeTeamId].title : 'Personal'}
          </ColumnTitle>
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
          <MenuSection
            isOpened
            lists={[inbox, favorites, trash]}
            activeListId={activeListId}
            onClickMenuItem={onClickMenuItem}
          />
          <MenuSection
            name="personal"
            lists={personalLists}
            activeListId={activeListId}
            isOpened={openedSectionNames.includes('personal')}
            onToggleSection={handleToggleSection('personal')}
            onClickMenuItem={onClickMenuItem}
          />
          {team && (
            <MenuSection
              name={generateTeamTag(team.title)}
              icon={team.icon}
              lists={teamLists}
              activeListId={activeListId}
              isOpened={openedSectionNames.includes('team')}
              onToggleSection={handleToggleSection('team')}
              onClickMenuItem={onClickMenuItem}
            />
          )}
          <MenuSection
            name="tools"
            activeListId={activeListId}
            isOpened={openedSectionNames.includes('tools')}
            onToggleSection={handleToggleSection('tools')}
          >
            <MenuItemWrapper>
              <MenuItem
                isActive={mode === SECURE_MESSAGE_MODE}
                onClick={onClickSecureMessage}
              >
                Secure Message
              </MenuItem>
            </MenuItemWrapper>
          </MenuSection>
        </Menu>
      </Scrollbar>
      {isDropdownOpened && <Overlay />}
    </>
  );
};

export const MenuList = memo(MenuListComponent);
