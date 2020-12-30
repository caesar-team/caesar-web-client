import React, { useState, useMemo, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { userListSelector } from '@caesar/common/selectors/entities/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import {
  SettingsWrapper,
  DataTable,
  TableStyles as Table,
  Avatar,
  Hint,
} from '@caesar/components';
import { getTeamTitle } from '@caesar/common/utils/team';
import { useDirection } from '@caesar/common/hooks';

const UserAvatar = styled(Avatar)`
  margin-right: 8px;
`;

const TeamHint = styled(Hint)`
  margin-left: 4px;
  border-bottom: 1px dashed ${({ theme }) => theme.color.black};
  cursor: pointer;
`;

const WIDTH_RATIO = {
  name: 0.35,
  email: 0.35,
  team: 0.3,
};

const SYMBOL_WIDTH = 8; // this is width of 'm' letter

const getColumnFilter = (placeholder = '') => ({
  column: { filterValue, setFilter },
}) => (
  <Table.HeaderInput
    prefix={Table.SearchIcon}
    value={filterValue || ''}
    onChange={e => {
      setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
    }}
    placeholder={placeholder}
  />
);

const createTableData = (users, teamsById) =>
  users.map(({ email, name, avatar, teamIds }) => {
    const userTeamsByName =
      teamIds?.map(id => getTeamTitle(teamsById[id])) || [];

    return {
      email,
      name,
      avatar,
      team: userTeamsByName.join(', '),
    };
  });

const createColumns = ({ tableWidth, tableScrollTop, tableHeight }) => [
  {
    accessor: 'name',
    width: tableWidth * WIDTH_RATIO.name,
    Filter: getColumnFilter('Name'),
    Header: () => null,
    Cell: ({ value, row: { original } }) => (
      <Table.Cell>
        <UserAvatar size={40} {...original} />
        {value}
      </Table.Cell>
    ),
  },
  {
    accessor: 'email',
    width: tableWidth * WIDTH_RATIO.email,
    Filter: getColumnFilter('Email'),
    Header: () => null,
    Cell: ({ value }) => <Table.EmailCell>{value}</Table.EmailCell>,
  },
  {
    accessor: 'team',
    width: tableWidth * WIDTH_RATIO.team,
    Filter: getColumnFilter('Team'),
    disableSortBy: true,
    Header: () => null,
    Cell: ({ value }) => {
      const columnWidth = tableWidth * WIDTH_RATIO.team;
      // 48 - horizontal paddings, 50 - width of 'more' text, 12 - width of ellipsis
      const visibleSymbols = (columnWidth - 48 - 50 - 12) / SYMBOL_WIDTH;
      const visibleText = value.slice(0, visibleSymbols);
      const hiddenText = value.slice(visibleSymbols);
      // 80 - symbols in one raw, 18 - height of a raw, 30 - padding from the top of a raw to top of a hint
      const modalHeight = Math.ceil(hiddenText.length / 80) * 18 + 30;

      const { cellRef, isUp } = useDirection({
        tableScrollTop,
        tableHeight,
        modalHeight,
      });

      return (
        <Table.Cell overflowHidden={false} ref={cellRef}>
          {visibleText}
          {hiddenText && '...'}
          {hiddenText && (
            <TeamHint
              text={`...${hiddenText}`}
              position={isUp ? 'top_left' : 'bottom_left'}
              hintMaxWidth={480}
            >
              more
            </TeamHint>
          )}
        </Table.Cell>
      );
    },
  },
];

export const Users = () => {
  const isLoading = useSelector(isLoadingSelector);

  // Window height minus stuff that takes vertical place (including table headers)
  const tableVisibleDataHeight = window?.innerHeight - 275;
  const [tableRowGroupNode, setTableRowGroupNode] = useState(null);
  const [tableWidth, setTableWidth] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setTableWidth(node.getBoundingClientRect().width);
      // To calculate where teamHint must be opened
      setTableRowGroupNode(node.children[0]?.children[1].children[0]);
    }
  }, []);

  const tableHeight = tableRowGroupNode?.offsetHeight;
  const [tableScrollTop, setTableScrollTop] = useState(0);

  useUpdateEffect(() => {
    if (!tableRowGroupNode) {
      return false;
    }

    const handler = () => {
      setTableScrollTop(tableRowGroupNode.scrollTop);
    };

    tableRowGroupNode.addEventListener('scroll', handler);

    return () => tableRowGroupNode.removeEventListener('scroll', handler);
  }, [tableRowGroupNode]);

  const users = useSelector(userListSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const tableData = useMemo(() => createTableData(users, teamsById), [
    users,
    teamsById,
  ]);
  const columns = useMemo(
    () => createColumns({ tableWidth, tableScrollTop, tableHeight }),
    [tableWidth, tableScrollTop, tableHeight],
  );

  return (
    <SettingsWrapper
      isLoading={isLoading}
      title={`All users (${users.length})`}
    >
      <Table.Main ref={measuredRef}>
        <DataTable
          columns={columns}
          data={tableData}
          initialState={{
            sortBy: [
              {
                id: 'name',
                desc: false,
              },
            ],
          }}
          tableVisibleDataHeight={tableVisibleDataHeight}
        />
      </Table.Main>
    </SettingsWrapper>
  );
};
