import React from 'react';
import styled from 'styled-components';
import { Avatar } from '../Avatar';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MemberInfo = styled.div`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MemberEmail = styled.div`
  font-size: ${({ theme }) => theme.font.size.main};
  color: ${({ theme }) => theme.color.black};
`;

const Member = ({ name, email, avatar, className }) => (
  <Wrapper className={className}>
    <Avatar
      size={32}
      fontSize="small"
      name={name}
      email={email}
      avatar={avatar}
    />
    <MemberInfo>{email && <MemberEmail>{email}</MemberEmail>}</MemberInfo>
  </Wrapper>
);

export default Member;
