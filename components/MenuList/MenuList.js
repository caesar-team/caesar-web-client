import React from 'react';
import styled from 'styled-components';
import { LIST_TYPE } from 'common/constants';
import Icon from '../Icon/Icon';
import Badge from '../Badge/Badge';

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 20px 0 40px;
`;

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  letter-spacing: 0.6px;
  margin-left: 20px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubMenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: ${({ theme, isActive }) => (isActive ? theme.black : theme.gray)};
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MenuList = ({ list, selectedListId, onClick }) => {
  const renderArrowOrBadge = (children, isListOfList, isActive) => {
    if (isListOfList) {
      const iconName = isActive ? 'arrow-up' : 'arrow-down';
      return <Icon name={iconName} width={16} height={16} />;
    }

    return children.length > 0 && <Badge count={children.length} />;
  };

  const renderSubMenu = items =>
    items.map(({ id, label, children }) => {
      // TODO: change the case to lowercase on backend
      const name = `${label
        .toLowerCase()
        .slice(0, 1)
        .toUpperCase()}${label.toLowerCase().slice(1)}`;

      const isActive =
        id === selectedListId ||
        children.filter(child => child.id === selectedListId).length > 0;
      const isListOfList =
        children.length > 0 &&
        children.every(child => child.type === LIST_TYPE);

      return (
        <SubMenu key={id}>
          <SubMenuItem isActive={isActive} onClick={onClick(id)}>
            {name} {renderArrowOrBadge(children, isListOfList, isActive)}
          </SubMenuItem>
          {isListOfList &&
            isActive && (
              <SubMenuItem isActive={isActive}>
                {renderSubMenu(children)}
              </SubMenuItem>
            )}
        </SubMenu>
      );
    });

  return <Menu>{renderSubMenu(list)}</Menu>;
};

export default MenuList;
