import React from 'react';
import styled from 'styled-components';
import { POST_REVIEW_MODE, POST_CREDENTIALS_TYPE } from 'common/constants';
import { matchStrict } from 'common/utils/match';
import { CredentialsPost, CredentialsForm } from './PostTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 60px;
  height: calc(100vh - 60px);
`;

const Post = ({
  isTrashPost = false,
  post,
  allLists,
  members = {},
  onClickEditPost = Function.prototype,
  onClickShare = Function.prototype,
  onFinishCreateWorkflow = Function.prototype,
  onFinishEditWorkflow = Function.prototype,
  onCancelWorkflow = Function.prototype,
  onClickRemovePost = Function.prototype,
  onClickRestorePost = Function.prototype,
  onClickMoveToTrash = Function.prototype,
}) => {
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
        <CredentialsPost
          isTrashPost={isTrashPost}
          post={post}
          members={members}
          allLists={allLists}
          onClickRemovePost={onClickRemovePost}
          onClickEditPost={onClickEditPost}
          onClickShare={onClickShare}
          onClickRestorePost={onClickRestorePost}
        />
      ),
    },
    null,
  );

  return (
    <Wrapper>
      {mode === POST_REVIEW_MODE ? renderedPost : renderedPostForm}
    </Wrapper>
  );
};

export default Post;
