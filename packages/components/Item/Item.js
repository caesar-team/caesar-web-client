import React, { Fragment, memo } from 'react';
import styled from 'styled-components';
import {
  ITEM_REVIEW_MODE,
  ITEM_CREDENTIALS_TYPE,
  ITEM_DOCUMENT_TYPE,
  PERMISSION_WRITE,
} from '@caesar/common/constants';
import { Button, Icon } from '@caesar/components';
import { formatDate } from '@caesar/common/utils/dateUtils';
import { matchStrict } from '@caesar/common/utils/match';
import equal from 'fast-deep-equal';
import EmptyItem from './EmptyItem';
import { Credentials, CredentialsForm, DocumentForm, Document } from './Types';
import { Scrollbar } from '../Scrollbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px 0;
  height: calc(100vh - 70px);
`;

const Notify = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ withButton }) =>
    withButton ? '10px 10px 10px 26px' : '20px 10px 20px 26px'};
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.black};
`;

const NotifyText = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.white};
`;

const NotifyButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: auto;
`;

const NotifyButton = styled(Button)`
  margin-left: 20px;
`;

const Item = ({
  isTrashItem = false,
  item,
  owner,
  childItems,
  user,
  membersById = {},
  teamsLists = [],
  notification,
  onClickMoveItem = Function.prototype,
  onClickCloseItem = Function.prototype,
  onClickEditItem = Function.prototype,
  onClickShare = Function.prototype,
  onFinishCreateWorkflow = Function.prototype,
  onFinishEditWorkflow = Function.prototype,
  onCancelWorkflow = Function.prototype,
  onClickRemoveItem = Function.prototype,
  onClickRestoreItem = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onToggleFavorites = Function.prototype,
  onClickAcceptUpdate = Function.prototype,
  onClickRejectUpdate = Function.prototype,
}) => {
  if (!item) {
    return <EmptyItem />;
  }

  const { mode, type, update, ownerId, id } = item;

  const renderedItemForm = matchStrict(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: (
        <CredentialsForm
          item={item}
          mode={mode}
          onFinishCreateWorkflow={onFinishCreateWorkflow}
          onFinishEditWorkflow={onFinishEditWorkflow}
          onCancelWorkflow={onCancelWorkflow}
        />
      ),
      [ITEM_DOCUMENT_TYPE]: (
        <DocumentForm
          item={item}
          mode={mode}
          onFinishCreateWorkflow={onFinishCreateWorkflow}
          onFinishEditWorkflow={onFinishEditWorkflow}
          onCancelWorkflow={onCancelWorkflow}
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
      <Notify withButton>
        <Icon name="warning" width={14} height={14} isInButton />
        <NotifyText>
          {`Item has been changed by ${updateUserName} at ${updateDate}`}
        </NotifyText>
        <NotifyButtonsWrapper>
          <Button color="white" onClick={onClickRejectUpdate(id)}>
            Reject
          </Button>
          <NotifyButton color="white" onClick={onClickAcceptUpdate(id)}>
            Accept
          </NotifyButton>
        </NotifyButtonsWrapper>
      </Notify>
    );
  };

  const renderedItem = matchStrict(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: (
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
          onClickMoveItem={onClickMoveItem}
          onClickCloseItem={onClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={onClickEditItem}
          onClickShare={onClickShare}
          onClickRestoreItem={onClickRestoreItem}
          onToggleFavorites={onToggleFavorites}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
      [ITEM_DOCUMENT_TYPE]: (
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
          onClickMoveItem={onClickMoveItem}
          onClickCloseItem={onClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={onClickEditItem}
          onClickShare={onClickShare}
          onClickRestoreItem={onClickRestoreItem}
          onToggleFavorites={onToggleFavorites}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
    },
    null,
  );

  return (
    <Fragment>
      {isReadOnly && (
        <Notify>
          <Icon name="warning" width={14} height={14} isInButton />
          <NotifyText>You can read only</NotifyText>
        </Notify>
      )}
      {update && renderUpdateNotify()}
      <Scrollbar>
        <Wrapper>
          {mode === ITEM_REVIEW_MODE ? renderedItem : renderedItemForm}
        </Wrapper>
      </Scrollbar>
    </Fragment>
  );
};

export default memo(Item, (prevProps, nextProps) => {
  return (
    equal(prevProps.item, nextProps.item) &&
    equal(prevProps.members, nextProps.members) &&
    equal(prevProps.notification, nextProps.notification)
  );
});
