/* eslint-disable camelcase */
import React, { memo, useState, useRef, useCallback } from 'react';
import { useEvent } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { PERMISSION } from '@caesar/common/constants';
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
  const [isVisibleDragZone, setVisibleDragZone] = useState(false);
  const itemRef = useRef(null);
  const notification = useNotification();
  const isDecryptionProgress = !item?.data;

  const handleDragEnter = useCallback(
    e => {
      const isItemContainsEventTarget = itemRef?.current?.contains(e.target);

      if (!isVisibleDragZone && isItemContainsEventTarget) {
        setVisibleDragZone(true);
      } else if (isVisibleDragZone && !isItemContainsEventTarget) {
        setVisibleDragZone(false);
      }
    },
    [isVisibleDragZone],
  );

  const handleDrop = useCallback(
    e => {
      if (isVisibleDragZone && itemRef?.current?.contains(e.target)) {
        setVisibleDragZone(false);
      }
    },
    [isVisibleDragZone],
  );

  useEvent('dragenter', handleDragEnter);
  useEvent('drop', handleDrop);

  if (!item) {
    return <EmptyItem />;
  }

  const isTrashItem =
    item &&
    (item.listId === trashList?.id ||
      teamsTrashLists.map(({ id }) => id).includes(item.listId));

  const handleClickAcceptEdit = patchData => {
    setSubmitting(true);

    dispatch(
      editItemRequest(
        {
          itemId: item.id,
          patch: patchData,
        },
        setSubmitting,
        notification,
      ),
    );
  };

  const handleClickRestoreItem = async () => {
    dispatch(
      moveItemRequest({
        itemId: item.id,
        teamId: item.teamId,
        listId: item.previousListId,
        notification,
        notificationText: `The item "${item?.meta?.title}" has been restored`,
      }),
    );
    dispatch(setWorkInProgressItem(null));
  };

  const { _permissions } = item || {};

  return (
    <Wrapper isDisabled={isSubmitting}>
      <ItemHeader
        item={item}
        onClickShare={onClickShare}
        onClickMove={() => setMoveModalOpened(true)}
        onClickRestoreItem={handleClickRestoreItem}
        onClickRemoveItem={onClickRemoveItem}
      />
      <Can not I={PERMISSION.EDIT} an={_permissions}>
        <ReadOnlyBanner />
      </Can>
      <InnerWrapper ref={itemRef}>
        <Scrollbar>
          <ItemByType
            item={item}
            itemSubject={_permissions}
            onClickAcceptEdit={!isTrashItem && handleClickAcceptEdit}
            onClickShare={onClickShare}
            isVisibleDragZone={isVisibleDragZone}
            isDummy={isDecryptionProgress}
          />
          {!isDecryptionProgress && (
            <>
              <Meta item={item} />
              <Can I={PERMISSION.TRASH} an={_permissions}>
                {!isTrashItem && (
                  <Row>
                    <RemoveButton onClick={onClickMoveToTrash} />
                  </Row>
                )}
              </Can>
            </>
          )}
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
