import React from 'react';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import memoize from 'memoize-one';
import FixedSizeItem from './FixedSizeItem';
import ScrollbarVirtualList from './ScrollbarVirtualList';
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

const ITEM_HEIGHT = 80;

const createItemData = memoize(
  (
    items,
    isMultiItem,
    workInProgressItemIds,
    workInProgressItem,
    onClickItem,
  ) => ({
    items,
    isMultiItem,
    workInProgressItemIds,
    workInProgressItem,
    onClickItem,
  }),
);

const SearchList = ({
  isMultiItem = false,
  workInProgressItem,
  workInProgressItemIds,
  items = [],
  onClickItem = Function.prototype,
}) => {
  const isEmpty = items.length === 0;

  const renderedList = () => {
    if (isEmpty) {
      return <EmptyList />;
    }

    const itemData = createItemData(
      items,
      isMultiItem,
      workInProgressItemIds,
      workInProgressItem,
      onClickItem,
    );

    return (
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={items.length}
            itemData={itemData}
            itemSize={ITEM_HEIGHT}
            width={width}
            outerElementType={ScrollbarVirtualList}
          >
            {FixedSizeItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    );
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
