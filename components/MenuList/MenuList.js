import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Section from './Section';
import { MenuItemWrapper, MenuItem } from './components';

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 30px 0 60px;
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
      openedSectionNames: [],
    };
  }

  render() {
    const { openedSectionNames } = this.state;
    const {
      mode,
      inbox,
      favorites,
      trash,
      list,
      activeListId,
      onClickMenuItem,
      onClickSecureMessage,
    } = this.props;

    return (
      <Menu>
        <Section
          isOpened
          lists={[inbox, favorites, trash]}
          activeListId={activeListId}
          onClickMenuItem={onClickMenuItem}
        />
        <Section
          name="personal"
          lists={list}
          activeListId={activeListId}
          isOpened={openedSectionNames.includes('personal')}
          onToggleSection={this.handleToggle('personal')}
          onClickMenuItem={onClickMenuItem}
        />
        <Section
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
        </Section>
      </Menu>
    );
  }
}

export default MenuList;
