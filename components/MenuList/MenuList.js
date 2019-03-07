import React, { Component } from 'react';
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

class MenuList extends Component {
  state = {
    isVisibleList: false,
  };

  handleToggle = () => {
    this.setState(prevState => ({
      isVisibleList: !prevState.isVisibleList,
    }));
  };

  renderTypes = ({ id, type, label, children }) => {
    const { isVisibleList } = this.state;
    const { selectedListId, onClick } = this.props;

    const sortedChildren = children.sort((a, b) => a.sort > b.sort);

    switch (type) {
      case INBOX_TYPE:
      case FAVORITES_TYPE:
      case TRASH_TYPE: {
        const isActive = id === selectedListId;

        return (
          <MenuItem key={id} isActive={isActive} onClick={onClick(id)}>
            {label}
            {children.length > 0 && <Badge count={children.length} />}
          </MenuItem>
        );
      }
      case LIST_TYPE: {
        const iconName = isVisibleList ? 'arrow-up-big' : 'arrow-down-big';

        return (
          <div key={id}>
            <MenuItem key={id} onClick={this.handleToggle}>
              {label}
              <StyledIcon name={iconName} width={14} height={14} />
            </MenuItem>
            {isVisibleList && (
              <div>
                {sortedChildren.map(child => {
                  const isActive = child.id === selectedListId;

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
      default:
        return null;
    }
  };

  render() {
    return <Menu>{this.props.list.map(this.renderTypes)}</Menu>;
  }
}

export default MenuList;
