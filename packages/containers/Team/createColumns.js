/* eslint-disable camelcase */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  DottedMenu,
  TeamAvatar,
  Select,
  Button,
  Can,
  TableStyles as Table,
} from '@caesar/components';
import {
  PERMISSION,
  PERMISSION_ENTITY,
  TEAM_ROLES_LABELS,
  TEAM_ROLES_OPTIONS,
} from '@caesar/common/constants';
import { ability } from '@caesar/common/ability';
import {
  ROLE_COLUMN_WIDTH,
  MENU_COLUMN_WIDTH,
  WIDTH_RATIO,
} from './constants';

const UserAvatar = styled(TeamAvatar)`
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
  background-color: ${({ theme }) => theme.color.emperor}!important;
  border-radius: ${({ theme }) => theme.borderRadius};
  right: 30px;
`;

const MenuButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.color.lightGray};
  background-color: transparent;
  border: 0;
  text-transform: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.white};
    border: 0;
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

const useDropdownDirection = ({
  tableScrollTop,
  tableHeight,
  optionLength = 1,
}) => {
  const cellRef = useRef(null);
  const [isDropdownUp, setDropdownUp] = useState(false);

  useEffect(() => {
    if (cellRef?.current) {
      const rowScrolledTopPosition = cellRef.current.closest('[role="row"]')
        ?.offsetTop;
      const rowTopPositionRelativeToTable =
        rowScrolledTopPosition - tableScrollTop;
      const dropdownBottomPosition =
        rowTopPositionRelativeToTable + (optionLength + 1) * 44 + 4;

      setDropdownUp(dropdownBottomPosition >= tableHeight);
    }
  }, [cellRef, tableScrollTop]);

  return { cellRef, isDropdownUp };
};

export const createColumns = ({
  tableWidth,
  tableHeight,
  tableScrollTop,
  canGrantAccessMember,
  currentUserId,
  handleChangeRole,
  handleOpenRemoveMemberModal,
  handleGrantAccessMember,
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

  const roleColumn = {
    accessor: 'teamRole',
    width: ROLE_COLUMN_WIDTH,
    Filter: getColumnFilter('Team role'),
    Header: () => null,
    Cell: ({ value, row: { original } }) => {
      const { cellRef, isDropdownUp } = useDropdownDirection({
        tableScrollTop,
        tableHeight,
        optionLength: TEAM_ROLES_OPTIONS.length,
      });
      const canChangeRole = 
        ability.can(PERMISSION.EDIT, getTeamMemberSubject(original)) &&
        currentUserId !== original.userId;

      return (
        <Table.DropdownCell ref={cellRef}>
          {canChangeRole ? (
            <StyledSelect
              name="role"
              value={value}
              options={TEAM_ROLES_OPTIONS}
              onChange={handleChangeRole(original.id)}
              boxDirection={isDropdownUp ? 'up' : 'down'}
            />
          ) : <Table.RoleCell>{TEAM_ROLES_LABELS[value]}</Table.RoleCell>}
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
      const _permissions = getTeamMemberSubject(original);
      const canDeleteMember = ability.can(PERMISSION.DELETE, _permissions);
      const mayGrantAccess = canGrantAccessMember && !original.accessGranted;
      const optionLength = [canDeleteMember, mayGrantAccess].reduce(
        (acc, option) => (option ? acc + 1 : acc),
        0,
      );
      const isAvailableMenu = optionLength > 0;

      const { cellRef, isDropdownUp } = useDropdownDirection({
        tableScrollTop,
        tableHeight,
        optionLength,
      });

      return (
        <Table.MenuCell ref={cellRef}>
          {isAvailableMenu && (
            <DottedMenu
              tooltipProps={{
                textBoxWidth: '100px',
                arrowAlign: 'end',
                position: `${isDropdownUp ? 'top' : 'bottom'} right`,
                padding: '0px 0px',
                flat: true,
                zIndex: '1',
                border: '0',
              }}
            >
              <MenuWrapper>
                <Can I={PERMISSION.DELETE} a={_permissions}>
                  <MenuButton
                    color="white"
                    onClick={handleOpenRemoveMemberModal(original)}
                  >
                    Remove
                  </MenuButton>
                </Can>
                {mayGrantAccess && (
                  <MenuButton
                    color="white"
                    onClick={handleGrantAccessMember(original.id)}
                  >
                    Grant access
                  </MenuButton>
                )}
              </MenuWrapper>
            </DottedMenu>
          )}
        </Table.MenuCell>
      );
    },
  };

  return [nameColumn, emailColumn, roleColumn, menuColumn];
};
