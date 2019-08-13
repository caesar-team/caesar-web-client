import React, { Component } from 'react';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import {
  LIST_TYPE,
  INBOX_TYPE,
  TRASH_TYPE,
  FAVORITES_TYPE,
} from 'common/constants';
import Icon from '../Icon/Icon';
import Badge from '../Badge/Badge';

const Menu = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.6px;
  font-size: 18px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  text-transform: capitalize;
  color: ${({ theme, isActive }) => (isActive ? theme.black : theme.emperor)};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.snow : theme.white};
  cursor: pointer;
  padding: 13px 20px 13px ${({ isNested }) => (isNested ? '80px' : '60px')};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.snow};

    svg {
      fill: ${({ theme }) => theme.middleGray};
    }
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.black};
  transition: all 0.2s;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

class MenuList extends Component {
  state = {
    isVisibleList: true,
  };

  shouldComponentUpdate(nextProps) {
    return !equal(nextProps, this.props);
  }

  handleToggle = () => {
    this.setState(prevState => ({
      isVisibleList: !prevState.isVisibleList,
    }));
  };

  renderLists() {
    const {
      mode,
      inbox,
      favorites,
      trash,
      list,
      workInProgressList,
      onClick,
    } = this.props;
    const { isVisibleList } = this.state;

    const lists = { inbox, favorites, trash, list };
    const keys = Object.keys(lists);

    return keys.map(key => {
      switch (key) {
        case INBOX_TYPE:
        case FAVORITES_TYPE:
        case TRASH_TYPE: {
          const { id, label, children } = lists[key];
          const isActive =
            mode !== SECURE_MESSAGE_MODE &&
            workInProgressList &&
            workInProgressList.id === id;

          return (
            <MenuItem key={id} isActive={isActive} onClick={onClick(id)}>
              {label}
              {children.length > 0 && <Badge count={children.length} />}
            </MenuItem>
          );
        }
        case LIST_TYPE: {
          const innerLists = lists[key];
          const sortedChildren = innerLists.sort((a, b) => a.sort - b.sort);
          const iconName = isVisibleList ? 'arrow-up-big' : 'arrow-down-big';

          return (
            <div key="lists">
              <MenuItem key="lists" onClick={this.handleToggle}>
                Lists
                <StyledIcon name={iconName} width={14} height={14} />
              </MenuItem>
              {isVisibleList && (
                <div>
                  {sortedChildren.map(child => {
                    const isActive =
                      mode !== SECURE_MESSAGE_MODE &&
                      workInProgressList &&
                      workInProgressList.id === child.id;

                    return (
                      <MenuItem
                        key={child.id}
                        isNested
                        isActive={isActive}
                        onClick={onClick(child.id)}
                      >
                        {child.label}
                        {child.children.length > 0 && (
                          <Badge count={child.children.length} />
                        )}
                      </MenuItem>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
      }
    });
  }

  render() {
    const { mode, onClickSecureMessage } = this.props;
    const renderedList = this.renderLists();

    return (
      <Menu>
        {renderedList}
        <MenuItem
          key="secure"
          isActive={mode === SECURE_MESSAGE_MODE}
          onClick={onClickSecureMessage}
        >
          Secure Message
        </MenuItem>
      </Menu>
    );
  }
}

export default MenuList;
