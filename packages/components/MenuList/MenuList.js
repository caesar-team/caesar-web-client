import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_VERSION, PERSONAL_TEAM_TYPE } from '@caesar/common/constants';
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
import { MenuListInner } from './MenuListInner';

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Box} {
    width: 100%;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.snow};
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

const MenuListComponent = ({
  mode,
  activeListId,
  onClickMenuItem,
  onClickSecureMessage,
}) => {
  const currentTeam = useSelector(currentTeamSelector);
  const user = useSelector(userDataSelector);
  const teamList = useSelector(teamsByIdSelector);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const activeTeamId = currentTeam?.id || PERSONAL_TEAM_TYPE;

  const handleToggleDropdown = isOpened => {
    setIsDropdownOpened(isOpened);
  };

  return (
    <>
      <StyledDropdown
        renderOverlay={handleToggle => (
          <TeamsList activeTeamId={activeTeamId} handleToggle={handleToggle} />
        )}
        onToggle={handleToggleDropdown}
      >
        <ColumnHeader>
          <Avatar avatar={teamList[activeTeamId]?.icon} {...user} isSmall />
          <ColumnTitle>
            {activeTeamId !== PERSONAL_TEAM_TYPE
              ? teamList[activeTeamId].title
              : 'Personal'}
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
          <MenuListInner
            activeListId={activeListId}
            onClickMenuItem={onClickMenuItem}
            mode={mode}
            onClickSecureMessage={onClickSecureMessage}
          />
          <AppVersion>{APP_VERSION}</AppVersion>
        </Menu>
      </Scrollbar>
      {isDropdownOpened && <Overlay />}
    </>
  );
};

export const MenuList = memo(MenuListComponent);
