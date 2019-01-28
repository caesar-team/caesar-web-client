import React, { Fragment } from 'react';
import styled from 'styled-components';
import {
  ITEM_REVIEW_MODE,
  ITEM_CREDENTIALS_TYPE,
  ITEM_DOCUMENT_TYPE,
  PERMISION_WRITE,
} from 'common/constants';
import { Icon } from 'components';
import { matchStrict } from 'common/utils/match';
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
  padding: 20px 26px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.black};
`;

const NotifyText = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.white};
`;

const Item = ({
  isTrashItem = false,
  item,
  allLists,
  user,
  members = {},
  onClickCloseItem = Function.prototype,
  onClickEditItem = Function.prototype,
  onClickInvite = Function.prototype,
  onFinishCreateWorkflow = Function.prototype,
  onFinishEditWorkflow = Function.prototype,
  onCancelWorkflow = Function.prototype,
  onClickRemoveItem = Function.prototype,
  onClickRestoreItem = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onToggleFavorites = Function.prototype,
}) => {
  if (!item) {
    return <EmptyItem />;
  }

  const { ownerId, mode, type, invited } = item;
  const renderedItemForm = matchStrict(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: (
        <CredentialsForm
          item={item}
          allLists={allLists}
          mode={mode}
          onFinishCreateWorkflow={onFinishCreateWorkflow}
          onFinishEditWorkflow={onFinishEditWorkflow}
          onCancelWorkflow={onCancelWorkflow}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
      [ITEM_DOCUMENT_TYPE]: (
        <DocumentForm
          item={item}
          allLists={allLists}
          mode={mode}
          onFinishCreateWorkflow={onFinishCreateWorkflow}
          onFinishEditWorkflow={onFinishEditWorkflow}
          onCancelWorkflow={onCancelWorkflow}
          onClickMoveToTrash={onClickMoveToTrash}
        />
      ),
    },
    null,
  );
  const isOwner = ownerId === user.id;
  const access = invited.reduce(
    (acc, invite) => (invite.userId === user.id ? invite.access : null),
    null,
  );
  const hasWriteAccess = isOwner || access === PERMISION_WRITE;
  const renderedItem = matchStrict(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: (
        <Credentials
          hasWriteAccess={hasWriteAccess}
          isTrashItem={isTrashItem}
          item={item}
          user={user}
          members={members}
          allLists={allLists}
          onClickCloseItem={onClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={onClickEditItem}
          onClickInvite={onClickInvite}
          onClickRestoreItem={onClickRestoreItem}
          onToggleFavorites={onToggleFavorites}
        />
      ),
      [ITEM_DOCUMENT_TYPE]: (
        <Document
          hasWriteAccess={hasWriteAccess}
          isTrashItem={isTrashItem}
          item={item}
          user={user}
          members={members}
          allLists={allLists}
          onClickCloseItem={onClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={onClickEditItem}
          onClickInvite={onClickInvite}
          onClickRestoreItem={onClickRestoreItem}
          onToggleFavorites={onToggleFavorites}
        />
      ),
    },
    null,
  );

  return (
    <Fragment>
      {!hasWriteAccess && (
        <Notify>
          <Icon name="warning" width={14} height={14} isInButton />
          <NotifyText>You can read only</NotifyText>
        </Notify>
      )}
      <Wrapper>
        <Scrollbar>
          {mode === ITEM_REVIEW_MODE ? renderedItem : renderedItemForm}
        </Scrollbar>
      </Wrapper>
    </Fragment>
  );
};

export default Item;
