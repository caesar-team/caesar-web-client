import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Checkbox } from '../Checkbox';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 30px;
  height: 30px;
  margin-left: 20px;
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 50%;

  background-color: ${({ isFilled, theme }) =>
    isFilled ? theme.black : theme.white};
`;

const MemberWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const MemberInfo = styled.div`
  padding-left: 20px;
`;

const MemberName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.black};
`;

const MemberEmail = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.gray};
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;

  fill: ${({ isFilled, theme }) => (isFilled ? theme.white : theme.black)};
`;

const Member = ({
  name,
  email,
  avatar,
  isInvited = false,
  isReadOnly,
  onClickPermissionChange = Function.prototype,
  onClickAdd = Function.prototype,
  onClickRemove = Function.prototype,
}) => (
  <Wrapper>
    <MemberWrapper>
      <Avatar name={name} avatar={avatar} />
      <MemberInfo>
        <MemberName>{name}</MemberName>
        <MemberEmail>{email}</MemberEmail>
      </MemberInfo>
    </MemberWrapper>
  </Wrapper>
);

export default Member;
