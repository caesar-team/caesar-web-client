import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import equal from 'fast-deep-equal';
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
import { EmptyItem } from './EmptyItem';
import { ItemByType } from './ItemByType';
import { ItemHeader, MoveModal } from './components';

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

  const { data, listId } = item;

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
