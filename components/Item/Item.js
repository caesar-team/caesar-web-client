import React from 'react';
import styled from 'styled-components';
import { ITEM_REVIEW_MODE, ITEM_CREDENTIALS_TYPE } from 'common/constants';
import { matchStrict } from 'common/utils/match';
import EmptyItem from './EmptyItem';
import { Credentials, CredentialsForm } from './Types';
import { Scrollbar } from '../Scrollbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px 0;
  height: calc(100vh - 70px);
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

  const { mode, type } = item;

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
    },
    null,
  );

  const renderedItem = matchStrict(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: (
        <Credentials
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
    <Wrapper>
      <Scrollbar>
        {mode === ITEM_REVIEW_MODE ? renderedItem : renderedItemForm}
      </Scrollbar>
    </Wrapper>
  );
};

export default Item;
