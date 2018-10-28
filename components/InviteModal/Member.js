import React from 'react';
import styled from 'styled-components';
import { List } from 'antd';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';

const { Item } = List;

const StyledItem = styled(Item)`
  padding-right: 20px;

  .ant-list-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const MemberWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MemberName = styled.div`
  font-size: 18px;
  line-height: 36px;
  color: #2e2f31;
  margin-left: 20px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledPlusIcon = styled(Icon)`
  cursor: pointer;

  > svg {
    fill: #3d70ff;
  }
`;

const Member = ({
  id,
  name,
  avatar,
  isInvited = false,
  onClickAdd = Function.prototype,
  onClickRemove = Function.prototype,
}) => {
  return (
    <StyledItem key={id}>
      <MemberWrapper>
        <Avatar name={name} avatar={avatar} />
        <MemberName>{name}</MemberName>
      </MemberWrapper>
      {isInvited ? (
        <StyledIcon type="check-circle" size={24} onClick={onClickRemove} />
      ) : (
        <StyledPlusIcon
          type="plus-circle"
          size={24}
          theme="filled"
          onClick={onClickAdd}
        />
      )}
    </StyledItem>
  );
};

export default Member;
