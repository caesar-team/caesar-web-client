import React from 'react';
import styled from 'styled-components';
import { Button, List } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PostListItem from './PostListItem';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;

  .ant-list-empty-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 60px);
    font-size: 18px;
    color: #2e2f31;
  }
`;

const StyledList = styled(List)`
  overflow-y: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  min-height: 60px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
`;

const Scrollbar = styled(Scrollbars)`
  height: calc(100vh - 60px);
`;

const Title = styled.div`
  font-size: 18px;
  color: #2e2f31;
  text-transform: uppercase;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  right: 20px;
`;

const StyledButton = styled(Button)`
  width: 60px;
  height: 60px;

  > .anticon {
    margin-top: 4px;

    > svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const PostList = ({
  title = '',
  activePostId = null,
  list = [],
  members = {},
  onClickPost = Function.prototype,
  onClickCreatePost = Function.prototype,
}) => (
  <Wrapper>
    <TitleWrapper>
      <Title>{title}</Title>
    </TitleWrapper>
    <Scrollbar>
      <StyledList
        bordered={false}
        size="large"
        dataSource={list}
        renderItem={props => (
          <PostListItem
            {...props}
            members={members}
            activePostId={activePostId}
            onClickPost={onClickPost}
          />
        )}
      />
    </Scrollbar>
    <ButtonWrapper>
      <StyledButton
        type="primary"
        shape="circle"
        icon="plus"
        onClick={onClickCreatePost}
      />
    </ButtonWrapper>
  </Wrapper>
);

export default PostList;
