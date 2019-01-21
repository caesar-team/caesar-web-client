import React from 'react';
import styled from 'styled-components';
import { LIST_TYPE } from 'common/constants';
import { Button, Scrollbar } from 'components';
import Item from './Item';
import EmptyList from './EmptyList';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.white};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 30px;
  background-color: ${({ theme }) => theme.white};
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const List = ({
  title = '',
  activeItemId = null,
  list,
  onClickItem = Function.prototype,
  onClickCreateItem = Function.prototype,
}) => {
  const renderedItems = list.children.map(({ id, ...props }) => {
    const isActive = id === activeItemId;

    return (
      <Item
        key={id}
        id={id}
        isActive={isActive}
        onClickItem={onClickItem}
        {...props}
      />
    );
  });

  const renderedList = () => {
    if (list.children.length === 0) {
      return <EmptyList />;
    }

    return <Scrollbar>{renderedItems}</Scrollbar>;
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
        <Button
          color="white"
          icon="plus"
          onClick={onClickCreateItem}
          isHoverBlackBackground
        />
      </TitleWrapper>
      {renderedList()}
    </Wrapper>
  );
};

export default List;
