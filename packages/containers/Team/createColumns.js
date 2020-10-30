/* eslint-disable camelcase */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  DottedMenu,
  Avatar,
  Select,
  Button,
  Can,
  TableStyles as Table,
} from '@caesar/components';
import {
  PERMISSION,
  PERMISSION_ENTITY,
  TEAM_ROLES_LABELS,
} from '@caesar/common/constants';
import {
  OPTIONS,
  ROLE_COLUMN_WIDTH,
  MENU_COLUMN_WIDTH,
  WIDTH_RATIO,
} from './constants';

const UserAvatar = styled(Avatar)`
  margin-right: 8px;
`;

const StyledSelect = styled(Select)`
  width: 100%;

  ${Select.SelectedOption} {
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.color.gallery};
  }
`;

const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  min-height: 42px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const MenuButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.color.black};
  border: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
    border: none;
  }
`;

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

const getTeamMemberSubject = member => ({
  ...member._permissions,
  __typename: PERMISSION_ENTITY.TEAM_MEMBER,
});

export const createColumns = ({
  tableWidth,
  tableHeight,
  tableScrollTop,
  handleChangeRole,
  handleRemoveMember,
}) => {
  const dynamicColumnsWidth =
    tableWidth - ROLE_COLUMN_WIDTH - MENU_COLUMN_WIDTH;

  const nameColumn = {
    accessor: 'name',
    width: dynamicColumnsWidth * WIDTH_RATIO.name,
    Filter: getColumnFilter('Name'),
    Header: () => null,
    Cell: ({ value, row: { original } }) => (
      <Table.Cell>
        <UserAvatar size={40} {...original} />
        {value}
      </Table.Cell>
    ),
  };

  const emailColumn = {
    accessor: 'email',
    width: dynamicColumnsWidth * WIDTH_RATIO.email,
    Filter: getColumnFilter('Email'),
    Header: () => null,
    Cell: ({ value }) => <Table.EmailCell>{value}</Table.EmailCell>,
  };

  const teamRoleColumn = {
    accessor: 'teamRole',
    width: ROLE_COLUMN_WIDTH,
    Filter: getColumnFilter('Role'),
    Header: () => null,
    Cell: ({ value, row: { original } }) => {
      const [isDropdownUp, setDropdownUp] = useState(false);
      const cellRef = useRef(null);

      useEffect(() => {
        if (cellRef?.current) {
          const rowScrolledTopPosition = cellRef.current.closest('[role="row"]')
            ?.offsetTop;
          const rowTopPositionRelativeToTable =
            rowScrolledTopPosition - tableScrollTop;
          const dropdownBottomPosition =
            rowTopPositionRelativeToTable + (OPTIONS.length + 1) * 44 + 4;

          setDropdownUp(dropdownBottomPosition >= tableHeight);
        }
      }, [cellRef, tableScrollTop]);

      return (
        <Table.DropdownCell ref={cellRef}>
          <Can I={PERMISSION.EDIT} of={getTeamMemberSubject(original)}>
            <StyledSelect
              name="teamRole"
              value={value}
              options={OPTIONS}
              onChange={handleChangeRole(original.id)}
              boxDirection={isDropdownUp ? 'up' : 'down'}
            />
          </Can>
          <Can not I={PERMISSION.EDIT} of={getTeamMemberSubject(original)}>
            <Table.RoleCell>{TEAM_ROLES_LABELS[value]}</Table.RoleCell>
          </Can>
        </Table.DropdownCell>
      );
    },
  };

  const menuColumn = {
    accessor: 'menu',
    width: MENU_COLUMN_WIDTH,
    disableFilters: true,
    disableSortBy: true,
    Header: () => null,
    Cell: ({ row: { original } }) => {
      return (
        <Table.MenuCell>
          <Can I={PERMISSION.DELETE} a={getTeamMemberSubject(original)}>
            <DottedMenu
              tooltipProps={{
                textBoxWidth: '100px',
                arrowAlign: 'start',
                position: 'left center',
                padding: '0px 0px',
                flat: true,
                zIndex: '1',
              }}
            >
              <MenuWrapper>
                <MenuButton
                  color="white"
                  onClick={handleRemoveMember(original.id)}
                >
                  Remove
                </MenuButton>
              </MenuWrapper>
            </DottedMenu>
          </Can>
        </Table.MenuCell>
      );
    },
  };

  return [nameColumn, emailColumn, teamRoleColumn, menuColumn];
};
