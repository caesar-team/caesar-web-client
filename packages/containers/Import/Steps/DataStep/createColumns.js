import React from 'react';
import { ITEM_TYPE } from '@caesar/common/constants';
import { Checkbox } from '@caesar/components';
import { FIRST_COLUMN_WIDTH, LAST_COLUMN_WIDTH } from './constants';
import { TypeSelect, CellWrapper, Cell, EyeIcon } from './styles';
import { capitalize, denormalize } from './utils';
import {
  handleSelectAll,
  handleSelectRow,
  handleChangeType,
  handleBlurField,
  handleKeyDown,
  handleClickEyeIcon,
} from './handlers';

export const createColumns = ({ state, setState, headings, tableWidth }) => {
  const columns = Object.keys(headings);
  const dataColumnWidth =
    (tableWidth - FIRST_COLUMN_WIDTH - LAST_COLUMN_WIDTH) / columns.length;

  const firstColumn = {
    id: 'checkbox',
    accessor: '',
    width: FIRST_COLUMN_WIDTH,
    disableSortBy: true,
    Header: ({ data }) => (
      <Checkbox
        checked={data.length === denormalize(state.selectedRows).length}
        onChange={handleSelectAll({ state, setState })}
      />
    ),
    Cell: ({ row: { original } }) => (
      <Checkbox
        checked={!!state.selectedRows[original.index]}
        onChange={handleSelectRow({
          rowIndex: original.index,
          state,
          setState,
        })}
      />
    ),
  };

  const lastColumn = {
    id: 'type',
    accessor: 'type',
    disableSortBy: true,
    width: LAST_COLUMN_WIDTH,
    Header: 'Type',
    Cell: ({ column, row: { original } }) => {
      const { login, pass, index } = original;
      const isCredentialsDisabled = !login || !pass;
      const isDocumentDisabled = false;

      const options = [
        {
          value: ITEM_TYPE.CREDENTIALS,
          label: 'Password',
          isDisabled: isCredentialsDisabled,
        },
        {
          value: ITEM_TYPE.DOCUMENT,
          label: 'Secure Note',
          isDisabled: isDocumentDisabled,
        },
      ];

      return (
        <TypeSelect
          name="type"
          options={options}
          value={state.data[index][column.id]}
          onChange={handleChangeType({ index, state, setState })}
        />
      );
    },
  };

  const restColumns = columns.map(id => ({
    id,
    accessor: id,
    disableSortBy: id === 'pass',
    width: dataColumnWidth > 0 ? dataColumnWidth : 100,
    Header: capitalize(id),
    Cell: ({ column, row: { original } }) => {
      const { index } = original;

      const cellData = state.data[index][column.id];
      const isPassword = column.id === 'pass';
      const isEmptyPassword = isPassword && !cellData;
      const isCurrentPasswordShown = state.indexShownPassword === index;
      const isDataShown = !isPassword || isCurrentPasswordShown;

      return (
        <CellWrapper isPassword={isPassword}>
          <Cell
            isEditableStyles={
              !isPassword ||
              isEmptyPassword ||
              (!isEmptyPassword && isDataShown)
            }
            contentEditable={isDataShown || isEmptyPassword}
            onBlur={handleBlurField({
              index,
              columnId: column.id,
              state,
              setState,
            })}
            onKeyDown={handleKeyDown({
              index,
              columnId: column.id,
              state,
              setState,
            })}
            dangerouslySetInnerHTML={{
              __html: !isDataShown && cellData ? '********' : cellData,
            }}
          />
          {isPassword && cellData && (
            <EyeIcon
              name={isCurrentPasswordShown ? 'eye-off' : 'eye-on'}
              width={16}
              height={16}
              color="gray"
              onClick={() => handleClickEyeIcon({ index, state, setState })}
            />
          )}
        </CellWrapper>
      );
    },
  }));

  return [firstColumn, ...restColumns, lastColumn];
};
