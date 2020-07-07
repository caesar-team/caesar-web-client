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
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import {
  moveItemRequest,
  editItemRequest,
} from '@caesar/common/actions/entities/item';
import { Error } from '../Error';
import { EmptyItem } from './EmptyItem';
import { ItemHeader, MoveModal } from './components';
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
  const [isMoveModalOpened, setIsMoveModalOpened] = useState(false);

  if (!item) {
    return <EmptyItem />;
  }

  const { type, data, listId } = item;

  const isTrashItem =
    item &&
    (item.listId === trashList.id ||
      teamsTrashLists.map(({ id }) => id).includes(item.listId));

  const handleClickAcceptEdit = ({ name, value }) => {
    setSubmitting(true);
    const updatedData = { ...data, listId, [name]: value };

    dispatch(editItemRequest(updatedData, setSubmitting, notification));
  };

  const handleClickRestoreItem = async () => {
    dispatch(moveItemRequest(item.id, null, item.previousListId));
    dispatch(setWorkInProgressItem(null));
  };

  const ItemByType = props => {
    switch (props.item.type) {
      case ITEM_TYPE.CREDENTIALS:
        return <Credentials {...props} />;
      case ITEM_TYPE.DOCUMENT:
        return <Document {...props} />;
      default:
        return <Error>Unknown type</Error>;
    }
  };

  return (
    <Wrapper isDisabled={isSubmitting}>
      <ItemHeader
        item={item}
        onClickShare={onClickShare}
        onClickMove={() => setIsMoveModalOpened(true)}
        onClickRestoreItem={handleClickRestoreItem}
        onClickRemoveItem={onClickRemoveItem}
      />
      <ItemByType
        item={item}
        onClickAcceptEdit={!isTrashItem && handleClickAcceptEdit}
        onClickShare={onClickShare}
        onClickMoveToTrash={!isTrashItem && onClickMoveToTrash}
      />
      <MoveModal
        item={item}
        isOpened={isMoveModalOpened}
        closeModal={() => setIsMoveModalOpened(false)}
      />
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
