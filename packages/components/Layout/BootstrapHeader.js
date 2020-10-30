import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logout } from '@caesar/common/actions/currentUser';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Logo } from './Logo';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
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
  text-align: right;
  margin-left: 20px;
`;

const BootstrapHeader = ({ currentUser, ...props }) => (
  <Wrapper>
    <LogoWrapper>
      <Logo href="/" />
    </LogoWrapper>
    <UserSection>
      <UserInfo>
        <Avatar {...currentUser} name={currentUser.email} />
        <UserName>{currentUser.name}</UserName>
      </UserInfo>
      <Button color="white" onClick={props.logout}>
        Log out
      </Button>
    </UserSection>
  </Wrapper>
);

const mapDispatchToProps = {
  logout,
};

export default connect(
  null,
  mapDispatchToProps,
)(BootstrapHeader);
