import React from 'react';
import Badge from '../Badge/Badge';
import { MenuItemWrapper, MenuItem } from './components';

const List = ({
  name,
  itemsLength = 0,
  isActive = false,
  onClick = Function.prototype,
}) => {
  return (
    <MenuItemWrapper isActive={isActive} onClick={onClick}>
      <MenuItem isActive={isActive}>{name}</MenuItem>
      {itemsLength > 0 && <Badge count={itemsLength} />}
    </MenuItemWrapper>
  );
};

export default List;
