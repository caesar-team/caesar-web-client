import React, { Fragment } from 'react';
import styled from 'styled-components';
import {
  ITEM_REVIEW_MODE,
  ITEM_CREDENTIALS_TYPE,
  ITEM_DOCUMENT_TYPE,
  PERMISION_WRITE,
} from 'common/constants';
import { Button, Icon } from 'components';
import { formatDate } from 'common/utils/dateFormatter';
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
  padding: ${({ withButton }) =>
    withButton ? '10px 10px 10px 26px' : '20px 10px 20px 26px'};
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.black};
`;

const NotifyText = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.white};
`;

const NotifyButton = styled(Button)`
  margin-left: auto;
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
  onClickShare = Function.prototype,
  onFinishCreateWorkflow = Function.prototype,
  onFinishEditWorkflow = Function.prototype,
  onCancelWorkflow = Function.prototype,
  onClickRemoveItem = Function.prototype,
  onClickRestoreItem = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onToggleFavorites = Function.prototype,
  onClickAcceptUpdate = Function.prototype,
}) => {
  if (!item) {
    return <EmptyItem />;
  }

  const { mode, type, invited, update, ownerId, id } = item;
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
        />
      ),
    },
    null,
  );
  const access = invited.reduce(
    (acc, invite) => (invite.userId === user.id ? invite.access : acc),
    null,
  );
  const hasWriteAccess = ownerId === user.id || access === PERMISION_WRITE;
  const showReadOnlyNotify = access && !hasWriteAccess;

  const renderUpdateNotify = () => {
    const updateUserName =
      update.userId === ownerId ? user.name : members[update.userId].name;
    const updateDate = formatDate(update.createdAt);

    return (
      <Notify withButton>
        <Icon name="warning" width={14} height={14} isInButton />
        <NotifyText>
          {`Password has been changed by ${updateUserName} at ${updateDate}`}
        </NotifyText>
        <NotifyButton color="white" onClick={onClickAcceptUpdate(id)}>
          Accept
        </NotifyButton>
      </Notify>
    );
  };

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
          item={item}
          user={user}
          members={members}
          allLists={allLists}
          onClickCloseItem={onClickCloseItem}
          onClickRemoveItem={onClickRemoveItem}
          onClickEditItem={onClickEditItem}
          onClickInvite={onClickInvite}
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
      {showReadOnlyNotify && (
        <Notify>
          <Icon name="warning" width={14} height={14} isInButton />
          <NotifyText>You can read only</NotifyText>
        </Notify>
      )}
      {update && renderUpdateNotify()}
      <Wrapper>
        <Scrollbar>
          {mode === ITEM_REVIEW_MODE ? renderedItem : renderedItemForm}
        </Scrollbar>
      </Wrapper>
    </Fragment>
  );
};

export default Item;
