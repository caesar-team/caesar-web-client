import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Dropdown, Menu } from 'antd';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';

const { Item } = Menu;

const Wrapper = styled.div`
  display: flex;
  padding: 0 30px;
  justify-content: flex-end;
  align-items: center;
  border-left: none;
  width: 100%;
  border-bottom: ${({ withBorder }) =>
    withBorder ? '1px solid #eaeaea' : 'none'};
`;

const StyledItem = styled(Item)`
  display: flex;
  align-items: center;
`;

const StyledMenu = styled(Menu)`
  margin-top: 6px;

  .ant-dropdown-menu-item {
    font-size: 18px;
    color: #2e2f31;
    padding: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PersonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const PersonName = styled.div`
  font-size: 18px;
  color: #2e2f31;
  margin: 0 10px;
`;

const handleLogout = () => {
  sessionStorage.setItem('isSetPassword', '0');
};

const Options = (
  <StyledMenu>
    <StyledItem key="lists">
      <Icon type="bars" size={20} />
      <Link href="/manage">
        <a>Lists manage</a>
      </Link>
    </StyledItem>
    <StyledItem key="logout">
      <Icon type="logout" size={20} />
      <Link href="/logout">
        <a href="/logout" onClick={handleLogout}>
          Log out
        </a>
      </Link>
    </StyledItem>
  </StyledMenu>
);

const Header = ({ user: { email, avatar }, withBorder }) => (
  <Wrapper withBorder={withBorder}>
    <Dropdown overlay={Options} placement="bottomCenter">
      <PersonWrapper>
        <Avatar name={email} avatar={avatar} />
        <PersonName>{email}</PersonName>
        <Icon type="down" size={20} />
      </PersonWrapper>
    </Dropdown>
  </Wrapper>
);

export default Header;
