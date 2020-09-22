import React, { useMemo, useCallback } from 'react';
import { useTable, useBlockLayout, useFilters, useSortBy } from 'react-table';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Filter = styled.div`
  margin-right: auto;
`;

const SortIcon = styled(Icon)`
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const ROW_HEIGHT = 56;

export const NewDataTable = ({
  columns,
  data,
  tableVisibleDataHeight,
  itemSize = ROW_HEIGHT,
}) => {
  const defaultColumn = useMemo(
    () => ({
      width: 180,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useFilters,
    useSortBy,
  );

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);

      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows],
  );

  return (
    <div {...getTableProps()} className="table">
      <div className="thead">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
                {column.canFilter && column.Filter ? (
                  <Filter>{column.render('Filter')}</Filter>
                ) : null}
                {column.canSort && (
                  <SortIcon
                    name="sort"
                    width={16}
                    height={16}
                    color="gray"
                    {...column.getSortByToggleProps()}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className="tbody">
        <FixedSizeList
          height={tableVisibleDataHeight}
          itemCount={rows.length}
          itemSize={itemSize}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );
};
