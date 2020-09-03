import React, { memo } from 'react';
import { areEqual } from 'react-window';
import { Item } from './Item';

const FixedSizeItemComponent = ({ data, index, style }) => {
  const { items, ...itemProps } = data;
  const item = items[index];

  return <Item style={style} key={item.id} {...item} {...itemProps} />;
};

export const FixedSizeItem = memo(FixedSizeItemComponent, areEqual);
