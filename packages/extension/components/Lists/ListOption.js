import React from 'react';
import styled from 'styled-components';
import { upperFirst, truncate } from '@caesar-utils/utils/string';
import { Icon } from '@caesar-ui';

const List = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-height: 40px;
`;

const ListName = styled.div`
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  color: ${({ theme }) => theme.color.black};
`;

const NameAndIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ListDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  max-height: 40px;
  min-height: 40px;
`;

const Item = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  max-height: 40px;
  min-height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ItemType = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.color.black};
  margin-right: 16px;
`;

const ItemName = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  color: ${({ theme }) => theme.color.black};
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledIcon = styled(Icon)`
  margin-right: 16px;
`;

const ArrowIcon = styled(Icon)`
  transform: ${({ isActive }) => (isActive ? 'scaleY(-1)' : 'scaleY(1)')};
  transition: transform 0.2s;
`;

const ListOption = ({
  list,
  items = [],
  workInProgressItem,
  icon,
  isActive,
  onClickItem,
  onClickList,
}) => {
  const renderedItems = items.map(item => {
    const isActiveItem =
      workInProgressItem && workInProgressItem.id === item.id;

    return (
      <Item key={item.id} onClick={onClickItem(item.id)}>
        <ItemType>
          <Icon name="key" width={16} height={16} fill="#fff" />
        </ItemType>
        <ItemName key={item.id} isActive={isActiveItem}>
          {truncate(item.data.name, 20)}
        </ItemName>
      </Item>
    );
  });

  return (
    <List key={list.id} onClick={onClickList(list.id)}>
      <ListDetails>
        {icon ? (
          <NameAndIconWrapper>
            <StyledIcon name={icon} width={16} height={16} />
            <ListName isActive={isActive}>{upperFirst(list.label)}</ListName>
          </NameAndIconWrapper>
        ) : (
          <ListName isActive={isActive}>{upperFirst(list.label)}</ListName>
        )}
        <ArrowIcon
          name="arrow-triangle"
          width={10}
          height={6}
          isActive={isActive}
        />
      </ListDetails>
      {isActive && <ItemsWrapper>{renderedItems}</ItemsWrapper>}
    </List>
  );
};

export default ListOption;
