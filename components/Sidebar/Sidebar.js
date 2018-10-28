import React from 'react';
import { Menu, Badge } from 'antd';
import styled from 'styled-components';
import LogoIcon from 'static/images/svg/icon-logo.svg';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  text-transform: uppercase;
`;

const MenuWrapper = styled(Menu)`
  border-right: none;
`;

const Item = styled(Menu.Item)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px !important;
  color: #2e2f31;
  margin: 0 auto !important;
  border-right: 1px solid #eaeaea;

  &:after {
    border-right: none !important;
    border-left: 3px solid #1890ff;
    left: 0;
  }
`;

const ItemName = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background: #888b90;
  }
`;

const StyledIcon = styled(Icon)`
  > svg {
    width: 88px;
    height: 16px;
  }
`;

const SubMenu = styled(Menu.SubMenu)`
  .ant-menu-submenu-title {
    margin: 0 auto !important;
    font-size: 18px;
    color: #2e2f31;
  }

  .ant-menu-submenu-arrow {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LISTS_TITLE = (
  <span>
    <Icon type="bars" size={20} />
    <Title>Lists</Title>
  </span>
);

const renderLists = ({ children }) =>
  children.map(({ id, label, children: nodes }) => (
    <Item key={id}>
      <ItemName>{label}</ItemName>
      <StyledBadge count={nodes.length} />
    </Item>
  ));

const prepareSections = ([inbox, lists, trash]) => ({
  inbox,
  lists,
  trash,
});

const Sidebar = ({
  sections = [],
  selectedKeys = null,
  onClickSection = Function.prototype,
}) => {
  const { inbox, lists, trash } = prepareSections(sections);

  return (
    <Wrapper>
      <LogoWrapper>
        <StyledIcon component={LogoIcon} />
      </LogoWrapper>
      <MenuWrapper
        mode="inline"
        selectedKeys={[selectedKeys]}
        defaultOpenKeys={[lists.id]}
        onClick={onClickSection}
      >
        <Item key={inbox.id}>
          <ItemName>
            <Icon type="inbox" size={20} />
            <Title>Inbox</Title>
          </ItemName>
          <StyledBadge count={inbox.children.length} />
        </Item>
        <SubMenu key={lists.id} title={LISTS_TITLE}>
          {renderLists(lists)}
        </SubMenu>
        <Item key={trash.id}>
          <ItemName>
            <Icon type="delete" size={20} />
            <Title>Trash</Title>
          </ItemName>
          <StyledBadge count={trash.children.length} />
        </Item>
      </MenuWrapper>
    </Wrapper>
  );
};

export default Sidebar;
