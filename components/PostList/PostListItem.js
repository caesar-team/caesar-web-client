import React from 'react';
import styled from 'styled-components';
import { List } from 'antd';
import { AvatarsList } from '../AvatarsList';
import { Icon } from '../Icon';

const { Item } = List;

const RowItem = styled(({ isActive, ...props }) => <Item {...props} />)`
  padding: 5px 20px 6px !important;
  min-height: 60px;
  background: ${({ isActive }) => (isActive ? '#fff' : '#f5f6fa')};
  cursor: pointer;
  border-bottom: none !important;
  border-left: ${({ isActive }) => (isActive ? '3px solid #1890ff' : 'none')};

  > .ant-list-item-content-single {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PostDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostName = styled.div`
  font-size: 18px;
  color: #2e2f31;
`;

const PostDate = styled.div`
  font-size: 15px;
  color: #888b90;
`;

const SharingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Attachments = styled.div`
  font-size: 15px;
  color: #888b90;
  margin-left: 10px;
`;

const StyledIcon = styled(Icon)`
  margin-right: 6px;
`;

const PostListItem = ({
  id,
  lastUpdated,
  secret: { name, attachments },
  shared,
  members,
  activePostId = null,
  onClickPost = Function.prototype,
}) => {
  const isActive = activePostId === id;
  const shouldShowAvatars = shared.length > 0;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowSharingWrapper = shouldShowAvatars || shouldShowAttachments;
  const avatars = shared.map(userId => members[userId]);

  return (
    <RowItem key={id} onClick={onClickPost(id)} isActive={isActive}>
      <PostDetails>
        <PostName>{name}</PostName>
        <PostDate>{lastUpdated}</PostDate>
      </PostDetails>
      {shouldShowSharingWrapper && (
        <SharingWrapper>
          {shouldShowAvatars && <AvatarsList avatars={avatars} />}
          {shouldShowAttachments && (
            <Attachments>
              <StyledIcon type="paper-clip" size={20} />
              {attachments.length}
            </Attachments>
          )}
        </SharingWrapper>
      )}
    </RowItem>
  );
};

export default PostListItem;
