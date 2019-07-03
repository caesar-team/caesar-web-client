import React from 'react';
import styled from 'styled-components';
import { Scrollbar } from 'components';
import Item from './Item';
import EmptyList from './EmptyList';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: ${({ isEmpty, theme }) =>
    isEmpty ? theme.white : theme.lightBlue};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: 62px;
  padding: 10px 30px;
  background-color: ${({ theme }) => theme.lightBlue};
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
`;

const Title = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const SearchList = ({
  isMultiItem = false,
  workInProgressItem,
  workInProgressItemIds,
  items = [],
  onClickItem = Function.prototype,
}) => {
  const renderedItems = items.map(({ id, ...props }) => {
    const isActive = isMultiItem
      ? workInProgressItemIds.includes(id)
      : workInProgressItem && workInProgressItem.id === id;

    return (
      <Item
        key={id}
        id={id}
        isMultiItem={isMultiItem}
        isActive={isActive}
        onClickItem={onClickItem}
        {...props}
      />
    );
  });

  const isEmpty = items.length === 0;
  const renderedList = () => {
    if (isEmpty) {
      return <EmptyList />;
    }

    return <Scrollbar>{renderedItems}</Scrollbar>;
  };

  const shouldShowTitle = !isEmpty || !isMultiItem;

  return (
    <Wrapper isEmpty={isEmpty}>
      {shouldShowTitle && (
        <TitleWrapper>
          <Title>Search results ({items.length} elements):</Title>
        </TitleWrapper>
      )}
      {renderedList()}
    </Wrapper>
  );
};

export default SearchList;
