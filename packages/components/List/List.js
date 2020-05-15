import React, { memo } from 'react';
import styled from 'styled-components';
import equal from 'fast-deep-equal';
import memoize from 'memoize-one';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  ITEM_TYPES,
  CREATE_PERMISSION,
  ITEM_ENTITY_TYPE,
  ITEM_ICON_TYPES,
} from '@caesar/common/constants';
import { Icon, Can } from '@caesar/components';
import FixedSizeItem from './FixedSizeItem';
import ScrollbarVirtualList from './ScrollbarVirtualList';
import EmptyList from './EmptyList';
import { Dropdown } from '../Dropdown';
import { withOfflineDetection } from '../Offline';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: ${({ isEmpty, theme }) =>
    isEmpty ? theme.color.white : theme.color.lightBlue};
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.snow};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.color.black};
`;

const CreateButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 3px;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  color: ${({ theme }) => theme.color.emperor};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};

  ${({ theme, disabled }) =>
    !disabled &&
    `
  &:hover {
    color: ${theme.color.white};
    background-color: ${theme.color.black};
    border: 1px solid ${theme.color.black};
  }
  `}
`;

const StyledIcon = styled(Icon)`
  margin-right: 15px;
`;

const Option = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 16px;
  letter-spacing: 0.5px;
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
    color: ${({ theme }) => theme.color.gray};
  }
`;

const ITEM_HEIGHT = 80;

const { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } = ITEM_TYPES;

const renderOption = (value, label) => (
  <Option key={value}>
    <StyledIcon name={ITEM_ICON_TYPES[value]} width={16} height={16} />
    {label}
  </Option>
);

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

const List = ({
  isMultiItem = false,
  workInProgressList,
  workInProgressItem,
  workInProgressItemIds,
  items = [],
  isOnline,
  onClickItem = Function.prototype,
  onClickCreateItem = Function.prototype,
}) => {
  if (!workInProgressList && !workInProgressItemIds.length) {
    return (
      <Wrapper isEmpty>
        <EmptyList />
      </Wrapper>
    );
  }

  const itemTypesOptions = [
    { label: 'Password', value: ITEM_CREDENTIALS_TYPE },
    { label: 'Secure note', value: ITEM_DOCUMENT_TYPE },
  ];

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

  const itemSubject = {
    __type: ITEM_ENTITY_TYPE,
    listType: workInProgressList.type,
    teamId: workInProgressList.teamId,
    userRole: workInProgressList.userRole,
  };

  return (
    <Wrapper isEmpty={isEmpty}>
      {!isMultiItem && (
        <ColumnHeader>
          <ColumnTitle>{workInProgressList.label}</ColumnTitle>
          <Can I={CREATE_PERMISSION} of={itemSubject}>
            <Dropdown
              options={itemTypesOptions}
              onClick={onClickCreateItem}
              optionRender={renderOption}
            >
              <CreateButton disabled={!isOnline}>
                <Icon withOfflineCheck name="plus" width={14} height={14} />
              </CreateButton>
            </Dropdown>
          </Can>
        </ColumnHeader>
      )}
      {renderedList()}
    </Wrapper>
  );
};

export default withOfflineDetection(
  memo(List, (prevProps, nextProps) => equal(prevProps, nextProps)),
);
