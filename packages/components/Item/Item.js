/* eslint-disable camelcase */
import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { PERMISSION, PERMISSION_ENTITY } from '@caesar/common/constants';
import { useNotification } from '@caesar/common/hooks';
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
import { Can } from '../Ability';
import { Scrollbar } from '../Scrollbar';
import { MoveModal } from '../MoveModal';
import { Row } from '../ItemFields/common';
import { EmptyItem } from './EmptyItem';
import { ItemByType } from './ItemByType';
import {
  ItemHeader,
  InnerWrapper,
  RemoveButton,
  ReadOnlyBanner,
  Meta,
} from './components';

const Wrapper = styled.div`
  height: 100%;

  ${({ isDisabled }) =>
    isDisabled &&
    `
    pointer-events: none;
  `}
`;

const ItemComponent = ({
  onClickShare = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickRemoveItem = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const item = useSelector(workInProgressItemSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isMoveModalOpened, setMoveModalOpened] = useState(false);
  // const [item, setItem] = useState(useSelector(workInProgressItemSelector));
  const notification = useNotification();

  if (!item) {
    return <EmptyItem />;
  }

  const isTrashItem =
    item &&
    (item.listId === trashList?.id ||
      teamsTrashLists.map(({ id }) => id).includes(item.listId));

  const handleClickAcceptEdit = patchData => {
    setSubmitting(true);
    const updatedData = {
      ...item,
      data: {
        ...item.data,
        ...patchData,
      },
    };
    dispatch(editItemRequest(updatedData, setSubmitting, notification));
  };

  const handleClickRestoreItem = async () => {
    dispatch(
      moveItemRequest(item.id, item.teamId || null, item.previousListId),
    );
    dispatch(setWorkInProgressItem(null));
  };

  const itemSubject = item.teamId
    ? {
        __typename: PERMISSION_ENTITY.TEAM_ITEM,
        team_edit_item: !!item._links?.team_edit_item,
        team_move_item: !!item._links?.team_move_item,
        team_batch_share_item: !!item._links?.team_batch_share_item,
        team_delete_item: !!item._links?.team_delete_item,
      }
    : {
        __typename: PERMISSION_ENTITY.ITEM,
        edit_item: !!item._links?.edit_item,
        move_item: !!item._links?.move_item,
        batch_share_item: !!item._links?.batch_share_item,
        delete_item: !!item._links?.delete_item,
      };

  return (
    <Wrapper isDisabled={isSubmitting}>
      <ItemHeader
        item={item}
        onClickShare={onClickShare}
        onClickMove={() => setMoveModalOpened(true)}
        onClickRestoreItem={handleClickRestoreItem}
        onClickRemoveItem={onClickRemoveItem}
      />
      <Can not I={PERMISSION.EDIT} an={itemSubject}>
        <ReadOnlyBanner />
      </Can>
      <InnerWrapper>
        <Scrollbar>
          <ItemByType
            item={item}
            itemSubject={itemSubject}
            onClickAcceptEdit={!isTrashItem && handleClickAcceptEdit}
            onClickShare={onClickShare}
          />
          <Meta item={item} />
          <Can I={PERMISSION.TRASH} an={itemSubject}>
            {!isTrashItem && (
              <Row>
                <RemoveButton onClick={onClickMoveToTrash} />
              </Row>
            )}
          </Can>
        </Scrollbar>
      </InnerWrapper>
      {!isTrashItem && isMoveModalOpened && (
        <MoveModal
          item={item}
          isOpened
          closeModal={() => setMoveModalOpened(false)}
        />
      )}
    </Wrapper>
  );
};

export const Item = memo(ItemComponent);
