import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { generateTeamTag } from 'common/utils/team';
import MenuSection from './MenuSection';
import { MenuItemWrapper, MenuItem } from './components';

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 30px 0 60px;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

class MenuList extends PureComponent {
  state = this.prepareInitialState();

  handleToggle = name => () => {
    this.setState(prevState => ({
      ...prevState,
      openedSectionNames: prevState.openedSectionNames.includes(name)
        ? prevState.openedSectionNames.filter(
            sectionName => sectionName !== name,
          )
        : prevState.openedSectionNames.concat(name),
    }));
  };

  prepareInitialState() {
    return {
      openedSectionNames: ['personal', 'tools'],
    };
  }

  render() {
    const { openedSectionNames } = this.state;
    const {
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
    } = this.props;

    return (
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
          onToggleSection={this.handleToggle('personal')}
          onClickMenuItem={onClickMenuItem}
        />
        {team && (
          <MenuSection
            name={generateTeamTag(team.title)}
            icon={team.icon}
            lists={teamLists}
            activeListId={activeListId}
            isOpened={openedSectionNames.includes('team')}
            onToggleSection={this.handleToggle('team')}
            onClickMenuItem={onClickMenuItem}
          />
        )}
        <MenuSection
          name="tools"
          activeListId={activeListId}
          isOpened={openedSectionNames.includes('tools')}
          onToggleSection={this.handleToggle('tools')}
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
    );
  }
}

export default MenuList;
