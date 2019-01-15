import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 50%;

  background-color: ${({ isFilled, theme }) =>
    isFilled ? theme.black : theme.white};
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

  fill: ${({ isFilled, theme }) => (isFilled ? theme.white : theme.black)};
`;

const Member = ({
  name,
  avatar,
  isInvited = false,
  onClickAdd = Function.prototype,
  onClickRemove = Function.prototype,
}) => (
  <Wrapper>
    <MemberWrapper>
      <Avatar name={name} avatar={avatar} />
      <MemberName>{name}</MemberName>
    </MemberWrapper>
    {isInvited ? (
      <IconWrapper isFilled>
        <StyledIcon
          isFilled
          name="ok"
          width={14}
          height={14}
          onClick={onClickRemove}
        />
      </IconWrapper>
    ) : (
      <IconWrapper>
        <StyledIcon name="plus" width={14} height={14} onClick={onClickAdd} />
      </IconWrapper>
    )}
  </Wrapper>
);

export default Member;
