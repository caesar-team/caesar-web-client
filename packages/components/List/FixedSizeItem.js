import React, { memo } from 'react';
import { areEqual } from 'react-window';
import { Item } from './Item';

const FixedSizeItemComponent = ({ style, ...item }) => (
  <Item style={style} key={item.id} {...item} />
);

export const FixedSizeItem = memo(FixedSizeItemComponent, areEqual);
