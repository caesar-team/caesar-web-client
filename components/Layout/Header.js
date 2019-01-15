import React, { Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';

const Wrapper = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  max-height: 70px;
  min-height: 70px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  flex-shrink: 0;
  padding-left: 60px;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 30px;
`;

const LogoLink = styled.a`
  display: block;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`;

const UserName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
  margin-left: 15px;
  margin-right: 15px;
`;

const StyledDropdown = styled(Dropdown)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Option = styled.div`
  padding: 10px 30px;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const Anchor = styled.a`
  color: ${({ theme }) => theme.black};

  &:hover {
    color: ${({ theme }) => theme.gray};
  }
`;

const Options = (
  <Fragment>
    <Option key="lists">
      <Link href="/manage">
        <Anchor>Lists manage</Anchor>
      </Link>
    </Option>
    <Option key="logout">
      <Link href="/logout">
        <Anchor href="/logout">Log out</Anchor>
      </Link>
    </Option>
  </Fragment>
);

export const Header = ({ user }) => (
  <Wrapper>
    <LeftWrapper>
      <Link href="/">
        <LogoLink>
          <Icon name="logo" width={116} height={25} />
        </LogoLink>
      </Link>
    </LeftWrapper>
    <RightWrapper>
      <UserSection>
        <Avatar {...user} name={user.email} />
        <StyledDropdown overlay={Options}>
          <UserName>{user.email}</UserName>
          <Icon name="arrow-down" width={10} height={16} />
        </StyledDropdown>
      </UserSection>
    </RightWrapper>
  </Wrapper>
);
