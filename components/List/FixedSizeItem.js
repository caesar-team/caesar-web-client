import React, { memo } from 'react';
import { areEqual } from 'react-window';
import Item from './Item';

const FixedSizeItem = memo(({ data, index, style }) => {
  const {
    items,
    isMultiItem,
    workInProgressItemIds,
    workInProgressItem,
    onClickItem,
  } = data;
  const item = items[index];

  const isActive = isMultiItem
    ? workInProgressItemIds.includes(item.id)
    : workInProgressItem && workInProgressItem.id === item.id;

  return (
    <Item
      style={style}
      key={item.id}
      id={item.id}
      isMultiItem={isMultiItem}
      isActive={isActive}
      onClickItem={onClickItem}
      {...item}
    />
  );
}, areEqual);

export default FixedSizeItem;
