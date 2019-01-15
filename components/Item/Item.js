import React from 'react';
import styled from 'styled-components';
import { POST_REVIEW_MODE, POST_CREDENTIALS_TYPE } from 'common/constants';
import { matchStrict } from 'common/utils/match';
import EmptyItem from './EmptyItem';
import { Credentials, CredentialsForm } from './Types';
import { Scrollbar } from '../Scrollbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 60px;
  height: calc(100vh - 70px);
`;

const Item = ({
  isTrashItem = false,
  post,
  allLists,
  members = {},
  itemPath,
  onClickCloseItem = Function.prototype,
  onClickEditPost = Function.prototype,
  onClickInvite = Function.prototype,
  onFinishCreateWorkflow = Function.prototype,
  onFinishEditWorkflow = Function.prototype,
  onCancelWorkflow = Function.prototype,
  onClickRemovePost = Function.prototype,
  onClickRestorePost = Function.prototype,
  onClickMoveToTrash = Function.prototype,
}) => {
  if (!post) {
    return <EmptyItem />;
  }

  const { mode, type } = post;

  const renderedPostForm = matchStrict(
    type,
    {
      [POST_CREDENTIALS_TYPE]: (
        <CredentialsForm
          post={post}
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

  const renderedPost = matchStrict(
    type,
    {
      [POST_CREDENTIALS_TYPE]: (
        <Credentials
          isTrashItem={isTrashItem}
          post={post}
          members={members}
          allLists={allLists}
          itemPath={itemPath}
          onClickCloseItem={onClickCloseItem}
          onClickRemovePost={onClickRemovePost}
          onClickEditPost={onClickEditPost}
          onClickInvite={onClickInvite}
          onClickRestorePost={onClickRestorePost}
        />
      ),
    },
    null,
  );

  return (
    <Wrapper>
      <Scrollbar>
        {mode === POST_REVIEW_MODE ? renderedPost : renderedPostForm}
      </Scrollbar>
    </Wrapper>
  );
};

export default Item;
