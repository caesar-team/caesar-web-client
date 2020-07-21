import React, { memo } from 'react';
import styled from 'styled-components';
import equal from 'fast-deep-equal';
import memoize from 'memoize-one';
import { upperFirst } from '@caesar/common/utils/string';
import { DASHBOARD_MODE, LIST_TYPES_ARRAY } from '@caesar/common/constants';
import { Scrollbar } from '../Scrollbar';
import { EmptyList } from './EmptyList';
import { Item } from './Item';

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

const ListComponent = ({
  mode,
  isMultiItem = false,
  workInProgressList = null,
  workInProgressItemIds,
  items = [],
  onClickItem = Function.prototype,
  onSelectItem = Function.prototype,
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

    // TODO: Need to check a long list with items. Mayby beetter to return AutoSizer, but need to fix Scrolling
    return (
      <Scrollbar>
        {items.map((item, index) => (
          <Item
            key={item.id}
            index={index}
            isMultiItem={isMultiItem}
            onClickItem={onClickItem}
            onSelectItem={onSelectItem}
            workInProgressItemIds={workInProgressItemIds}
            {...item}
          />
        ))}
      </Scrollbar>
    );
  };

  const itemTitle = LIST_TYPES_ARRAY.includes(workInProgressList?.label)
    ? upperFirst(workInProgressList?.label)
    : workInProgressList?.label;

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
