import React, { memo } from 'react';
import styled from 'styled-components';
import equal from 'fast-deep-equal';
import memoize from 'memoize-one';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { upperFirst } from '@caesar/common/utils/string';
import { DASHBOARD_MODE, LIST_TYPES_ARRAY } from '@caesar/common/constants';
import { Button } from '@caesar/components';
import { FixedSizeItem } from './FixedSizeItem';
import { ScrollbarVirtualList } from './ScrollbarVirtualList';
import { EmptyList } from './EmptyList';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 55px);
  background-color: ${({ isEmpty, theme }) =>
    isEmpty ? theme.color.white : theme.color.alto};
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.black};
`;

const ITEM_HEIGHT = 56;

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

const ListComponent = ({
  mode,
  isMultiItem = false,
  workInProgressList = null,
  workInProgressItem,
  workInProgressItemIds,
  items = [],
  onClickItem = Function.prototype,
}) => {
  const isDashboardDefaultMode = mode === DASHBOARD_MODE.DEFAULT;

  if (
    isDashboardDefaultMode &&
    !workInProgressList &&
    !workInProgressItemIds.length
  ) {
    return (
      <Wrapper isEmpty>
        <EmptyList />
      </Wrapper>
    );
  }

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

  const itemTitle = LIST_TYPES_ARRAY.includes(workInProgressList.label)
    ? upperFirst(workInProgressList.label)
    : workInProgressList.label;

  return (
    <Wrapper isEmpty={isEmpty}>
      {!isMultiItem && (
        <ColumnHeader>
          <ColumnTitle>
            {isDashboardDefaultMode
              ? itemTitle
              : `Search results (${items.length} elements):`}
          </ColumnTitle>
          {/* TODO: Add sharing list functional; Set condition when to show this button */}
          {/* <Button
            icon="share-network"
            color="white"
            onClick={() => {
              console.log('Sharing modal');
            }}
          /> */}
        </ColumnHeader>
      )}
      {renderedList()}
    </Wrapper>
  );
};

export const List = memo(ListComponent, (prevProps, nextProps) =>
  equal(prevProps, nextProps),
);
