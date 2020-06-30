import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import equal from 'fast-deep-equal';
import { ITEM_TYPE } from '@caesar/common/constants';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { editItemRequest } from '@caesar/common/actions/entities/item';
import { ItemHeader } from '../ItemFields';
import { EmptyItem } from './EmptyItem';
import { Credentials, Document } from './types';

const Wrapper = styled.div`
  ${({ isDisabled }) =>
    isDisabled &&
    `
    pointer-events: none;
  `}
`;

const ItemComponent = ({
  notification,
  onClickShare = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickRemoveItem = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const item = useSelector(workInProgressItemSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const [isSubmitting, setSubmitting] = useState(false);

  if (!item) {
    return <EmptyItem />;
  }

  const { type, data, listId } = item;

  const handleClickAcceptEdit = ({ name, value }) => {
    setSubmitting(true);
    const updatedData = { ...data, listId, [name]: value };

    dispatch(editItemRequest(updatedData, setSubmitting, notification));
  };

  const isTrashItem =
    item &&
    (item.listId === trashList.id ||
      teamsTrashLists.map(({ id }) => id).includes(item.listId));

  const onClickRemove = isTrashItem ? onClickRemoveItem : onClickMoveToTrash;

  const renderedItem = {
    [ITEM_TYPE.CREDENTIALS]: (
      <Credentials
        item={item}
        handleClickAcceptEdit={handleClickAcceptEdit}
        onClickRemove={onClickRemove}
      />
    ),
    [ITEM_TYPE.DOCUMENT]: (
      <Document
        item={item}
        handleClickAcceptEdit={handleClickAcceptEdit}
        onClickRemove={onClickRemove}
      />
    ),
  };

  return (
    <Wrapper isDisabled={isSubmitting}>
      <ItemHeader item={item} />
      {renderedItem[type]}
    </Wrapper>
  );
};

export const Item = memo(ItemComponent, (prevProps, nextProps) => {
  return (
    equal(prevProps.item, nextProps.item) &&
    equal(prevProps.members, nextProps.members) &&
    equal(prevProps.notification, nextProps.notification)
  );
});
