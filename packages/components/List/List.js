import React, { memo } from 'react';
import equal from 'fast-deep-equal';
import memoize from 'memoize-one';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';
import { transformListTitle } from '@caesar/common/utils/string';
import { DASHBOARD_MODE } from '@caesar/common/constants';
import { Scrollbar } from '../Scrollbar';
import { EmptyList } from './EmptyList';
import { FixedSizeItem } from './FixedSizeItem';

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
  flex: 0 0 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.black};
`;

const createItemData = memoize(
  ({
    items,
    isMultiItem,
    onClickItem,
    onSelectItem,
    workInProgressItemIds,
    workInProgressItem,
  }) => ({
    items,
    isMultiItem,
    onClickItem,
    onSelectItem,
    workInProgressItemIds,
    workInProgressItem,
  }),
);

const RenderedList = ({
  items,
  isMultiItem,
  teamMembersCount,
  onClickItem,
  onSelectItem,
  workInProgressItemIds,
  workInProgressItem,
}) => {
  const itemData = createItemData({
    items,
    isMultiItem,
    teamMembersCount,
    onClickItem,
    onSelectItem,
    workInProgressItemIds,
    workInProgressItem,
  });

  return (
    <Scrollbar>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={items.length}
            itemData={itemData}
            itemSize={58}
            width={width}
          >
            {FixedSizeItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Scrollbar>
  );
};

const ListComponent = ({
  mode,
  isMultiItem = false,
  workInProgressList = null,
  workInProgressItemIds,
  workInProgressItem,
  items = [],
  teamMembersCount = 1,
  onClickItem = Function.prototype,
  onSelectItem = Function.prototype,
}) => {
  const isDashboardDefaultMode = mode === DASHBOARD_MODE.DEFAULT;
  const isEmpty = items.length === 0;

  if (
    isEmpty ||
    (isDashboardDefaultMode &&
      !workInProgressList &&
      !workInProgressItemIds.length)
  ) {
    return (
      <Wrapper isEmpty>
        <EmptyList />
      </Wrapper>
    );
  }

  const listTitle = transformListTitle(workInProgressList?.label);

  return (
    <Wrapper isEmpty={isEmpty}>
      {!isMultiItem && (
        <ColumnHeader>
          <ColumnTitle>
            {isDashboardDefaultMode
              ? listTitle
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
      <RenderedList
        items={items}
        isMultiItem={isMultiItem}
        teamMembersCount={teamMembersCount}
        onClickItem={onClickItem}
        onSelectItem={onSelectItem}
        workInProgressItemIds={workInProgressItemIds}
        workInProgressItem={workInProgressItem}
      />
    </Wrapper>
  );
};

export const List = memo(ListComponent, (prevProps, nextProps) =>
  equal(prevProps, nextProps),
);
