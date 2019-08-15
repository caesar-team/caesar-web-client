import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Logo } from './Logo';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  padding: 16px 60px;
  width: 100%;
  margin-bottom: 20px;
`;

const LogoWrapper = styled.div``;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 30px;
`;

const UserName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  text-align: right;
  margin-left: 20px;
`;

const BootstrapHeader = ({ user, router }) => (
  <Wrapper>
    <LogoWrapper>
      <Logo href="/" />
    </LogoWrapper>
    <UserSection>
      <UserInfo>
        <Avatar {...user} name={user.email} />
        <UserName>{user.name}</UserName>
      </UserInfo>
      <Button color="white" onClick={() => router.push('/logout')}>
        LOG OUT
      </Button>
    </UserSection>
  </Wrapper>
);

export default withRouter(BootstrapHeader);
