import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  ITEM_MODE,
  ITEM_TYPE,
  ITEM_TEXT_TYPE,
  PERMISSION_WRITE,
} from '@caesar/common/constants';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  workInProgressItemSelector,
  workInProgressItemOwnerSelector,
  workInProgressItemChildItemsSelector,
} from '@caesar/common/selectors/workflow';
import {
  trashListSelector,
  teamsTrashListsSelector,
  selectableTeamsListsSelector,
} from '@caesar/common/selectors/entities/list';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import {
  moveItemRequest,
  createItemRequest,
  editItemRequest,
  acceptItemUpdateRequest,
  rejectItemUpdateRequest,
  toggleItemToFavoriteRequest,
} from '@caesar/common/actions/entities/item';
import { Button, Icon } from '@caesar/components';
import { formatDate } from '@caesar/common/utils/dateUtils';
import { matchStrict } from '@caesar/common/utils/match';
import equal from 'fast-deep-equal';
import { EmptyItem } from './EmptyItem';
import { Credentials, CredentialsForm, DocumentForm, Document } from './Types';
import { Scrollbar } from '../Scrollbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px 0;
  height: calc(100vh - 111px);
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
`;

const Notify = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ withButton }) =>
    withButton ? '10px 10px 10px 26px' : '20px 10px 20px 26px'};
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

const NotifyText = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.color.white};
`;

const NotifyButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: auto;
`;

const NotifyButton = styled(Button)`
  margin-left: 20px;
`;

const ItemComponent = ({
  notification,
  onClickShare = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickRemoveItem = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const teamsLists = useSelector(selectableTeamsListsSelector);
  const item = useSelector(workInProgressItemSelector);
  const owner = useSelector(workInProgressItemOwnerSelector);
  const childItems = useSelector(workInProgressItemChildItemsSelector);
  const membersById = useSelector(membersByIdSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);

  const isTrashItem =
    item &&
    (item.listId === trashList.id ||
      teamsTrashLists.map(({ id }) => id).includes(item.listId));

  const handleClickMoveItem = (teamId, listId) => {
    dispatch(moveItemRequest(item.id, listId));
    dispatch(setWorkInProgressItem(null));

    notification.show({
      text: `The ${ITEM_TEXT_TYPE[item.type]} has been moved.`,
    });
  };

  const handleClickCloseItem = () => {
    dispatch(setWorkInProgressItem(null));
  };

  const handleClickEditItem = () => {
    dispatch(setWorkInProgressItem(item, ITEM_MODE.WORKFLOW_EDIT));
  };

  const handleFinishCreateWorkflow = (data, { setSubmitting }) => {
    dispatch(createItemRequest(data, setSubmitting));
  };

  const handleFinishEditWorkflow = (data, { setSubmitting }) => {
    dispatch(editItemRequest(data, setSubmitting));

    notification.show({
      text: `The ${ITEM_TEXT_TYPE[data.type]} has been updated`,
    });
  };

  const handleClickCancelWorkflow = () => {
    dispatch(
      setWorkInProgressItem(
        item.mode === ITEM_MODE.WORKFLOW_EDIT ? item : null,
        item.mode === ITEM_MODE.WORKFLOW_EDIT ? ITEM_MODE.REVIEW : null,
      ),
    );
  };

  const handleClickRestoreItem = async () => {
    dispatch(moveItemRequest(item.id, item.previousListId));
    dispatch(setWorkInProgressItem(null));
  };

  const handleToggleFavorites = id => () => {
    dispatch(toggleItemToFavoriteRequest(id));
  };

  const handleAcceptUpdate = id => () => {
    dispatch(acceptItemUpdateRequest(id));
  };

  const handleRejectUpdate = id => () => {
    dispatch(rejectItemUpdateRequest(id));
  };

  if (!item) {
    return <EmptyItem />;
  }

  const { mode, type, update, ownerId, id } = item;

  const renderedItemForm = matchStrict(
    type,
    {
      [ITEM_TYPE.CREDENTIALS]: (
        <CredentialsForm
          item={item}
          mode={mode}
          onFinishCreateWorkflow={handleFinishCreateWorkflow}
          onFinishEditWorkflow={handleFinishEditWorkflow}
          onCancelWorkflow={handleClickCancelWorkflow}
        />
      ),
      [ITEM_TYPE.DOCUMENT]: (
        <DocumentForm
          item={item}
          mode={mode}
          onFinishCreateWorkflow={handleFinishCreateWorkflow}
          onFinishEditWorkflow={handleFinishEditWorkflow}
          onCancelWorkflow={handleClickCancelWorkflow}
        />
      ),
    },
    null,
  );

  const access = childItems.reduce(
    (acc, childItem) => (childItem.userId === user.id ? childItem.access : acc),
    null,
  );
  const hasWriteAccess = ownerId === user.id || access === PERMISSION_WRITE;
  const isReadOnly = access && !hasWriteAccess;

  const renderUpdateNotify = () => {
    const updateUserName = membersById[update.userId]
      ? membersById[update.userId].name
      : '';

    const updateDate = formatDate(update.createdAt);

    return (
      <>
        <ColumnHeader>
          <ColumnTitle>Personal | Passwords</ColumnTitle>
        </ColumnHeader>
        <Notify withButton>
          <Icon name="warning" width={14} height={14} />
          <NotifyText>
            {`Item has been changed by ${updateUserName} at ${updateDate}`}
          </NotifyText>
          <NotifyButtonsWrapper>
            <Button color="white" onClick={handleRejectUpdate(id)}>
              Reject
            </Button>
            <NotifyButton color="white" onClick={handleAcceptUpdate(id)}>
              Accept
            </NotifyButton>
          </NotifyButtonsWrapper>
        </Notify>
      </>
    );
  };

  const renderedItem = matchStrict(
    type,
    {
      [ITEM_TYPE.CREDENTIALS]: (
        <Credentials
          notification={notification}
          hasWriteAccess={hasWriteAccess}
          isTrashItem={isTrashItem}
          isReadOnly={isReadOnly}
          item={item}
          owner={owner}
          childItems={childItems}
          user={user}
          membersById={membersById}
          teamsLists={teamsLists}
          onClickMoveItem={handleClickMoveItem}
          onClickCloseItem={handleClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={handleClickEditItem}
          onClickShare={onClickShare}
          onClickRestoreItem={handleClickRestoreItem}
          onToggleFavorites={handleToggleFavorites}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
      [ITEM_TYPE.DOCUMENT]: (
        <Document
          hasWriteAccess={hasWriteAccess}
          isTrashItem={isTrashItem}
          isReadOnly={isReadOnly}
          item={item}
          owner={owner}
          childItems={childItems}
          user={user}
          membersById={membersById}
          teamsLists={teamsLists}
          onClickMoveItem={handleClickMoveItem}
          onClickCloseItem={handleClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={handleClickEditItem}
          onClickShare={onClickShare}
          onClickRestoreItem={handleClickRestoreItem}
          onToggleFavorites={handleToggleFavorites}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
    },
    null,
  );

  return (
    <>
      <ColumnHeader>
        <ColumnTitle>Personal | Passwords</ColumnTitle>
      </ColumnHeader>
      {isReadOnly && (
        <Notify>
          <Icon name="warning" width={14} height={14} />
          <NotifyText>You can read only</NotifyText>
        </Notify>
      )}
      {update && renderUpdateNotify()}
      <Scrollbar>
        <Wrapper>
          {mode === ITEM_MODE.REVIEW ? renderedItem : renderedItemForm}
        </Wrapper>
      </Scrollbar>
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
