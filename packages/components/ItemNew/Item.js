import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import equal from 'fast-deep-equal';
import { ITEM_TYPE } from '@caesar/common/constants';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { ItemHeader } from '../ItemFields';
import { EmptyItem } from './EmptyItem';
import { Credentials, Document } from './types';

const ItemComponent = ({
  notification,
  onClickShare = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickRemoveItem = Function.prototype,
}) => {
  const item = useSelector(workInProgressItemSelector);

  if (!item) {
    return <EmptyItem />;
  }

  const { type } = item;

  const renderedItem = {
    [ITEM_TYPE.CREDENTIALS]: <Credentials item={item} />,
    [ITEM_TYPE.DOCUMENT]: <Document item={item} />,
  };

  return (
    <>
      <ItemHeader item={item} />
      {renderedItem[type]}
    </>
  );
};

export const Item = memo(ItemComponent, (prevProps, nextProps) => {
  return (
    equal(prevProps.item, nextProps.item) &&
    equal(prevProps.members, nextProps.members) &&
    equal(prevProps.notification, nextProps.notification)
  );
});
