import React, { Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  border-left: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  padding: 0 30px;
  max-height: 70px;
  min-height: 70px;
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchText = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.gray};
  margin-left: 20px;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
  margin-left: 15px;
  margin-right: 15px;
`;

const SearchIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
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

const Panel = ({ user }) => (
  <Wrapper>
    {/*<SearchSection>*/}
      {/*<SearchIcon name="search" width={18} height={18} />*/}
      {/*<SearchText>Search by Caesar… </SearchText>*/}
    {/*</SearchSection>*/}
    <UserSection>
      <Avatar {...user} name={user.email} />
      <StyledDropdown overlay={Options}>
        <UserName>{user.email}</UserName>
        <Icon name="arrow-down" width={10} height={16} />
      </StyledDropdown>
    </UserSection>
  </Wrapper>
);

export default Panel;
