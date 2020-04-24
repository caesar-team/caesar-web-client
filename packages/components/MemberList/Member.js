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

const MemberName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.black};
`;

const MemberEmail = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.gray};
`;

const Member = ({ name, email, avatar, className }) => (
  <Wrapper className={className}>
    <Avatar isSmall name={name} email={email} avatar={avatar} />
    <MemberInfo>
      {name && <MemberName>{name}</MemberName>}
      {email && <MemberEmail>{email}</MemberEmail>}
    </MemberInfo>
  </Wrapper>
);

export default Member;
