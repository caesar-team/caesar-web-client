import React, { memo } from 'react';
import { areEqual } from 'react-window';
import { Item } from './Item';

const FixedSizeItemComponent = ({ data, index, style }) => {
  const {
    items,
    isMultiItem,
    workInProgressItemIds,
    workInProgressItem,
    onClickItem,
    onSelectItem,
  } = data;
  const item = items[index];

  const isActive = isMultiItem && workInProgressItemIds.includes(item.id);

  return (
    <Item
      style={style}
      key={item.id}
      id={item.id}
      isMultiItem={isMultiItem}
      isActive={isActive}
      onClickItem={onClickItem}
      onSelectItem={onSelectItem}
      {...item}
    />
  );
};

export const FixedSizeItem = memo(FixedSizeItemComponent, areEqual);
