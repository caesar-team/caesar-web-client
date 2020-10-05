import React from 'react';
import styled from 'styled-components';
import { Input } from '../Input';
import { Icon } from '../Icon';

const Main = styled.div`
  .table {
    display: inline-block;

    .th,
    .td {
      padding: 8px 24px;
      text-align: left;
    }

    .thead .tr {
      margin-bottom: 8px;
      border-bottom: 1px solid ${({ theme }) => theme.color.emperor};
    }

    .thead .th {
      display: inline-flex !important;
      align-items: center;
      padding-top: 0;
      padding-bottom: 0;
    }

    .tbody .td {
      display: inline-flex !important;
      align-items: center;
      margin-bottom: 4px;
      background-color: ${({ theme }) => theme.color.white};
    }
  }
`;

const Header = styled.div``;

const HeaderInput = styled(Input)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;

  ${Input.Prefix} {
    position: relative;
    top: 0;
    left: 0;
    margin-right: 8px;
    transform: none;
  }

  ${Input.InputField} {
    padding: 0;
    background-color: transparent;

    &::placeholder {
      text-transform: uppercase;
    }
  }
`;

const Cell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
`;

const EmailCell = styled.div`
  color: ${({ theme }) => theme.color.gray};
`;

const DropdownCell = styled(Cell)`
  width: 100%;
  overflow: initial;
`;

const MenuCell = styled(Cell)`
  overflow: initial;
`;

const SearchIcon = <Icon name="search" width={16} height={16} color="gray" />;

export const TableStyles = {
  Main,
  Header,
  HeaderInput,
  Cell,
  EmailCell,
  DropdownCell,
  MenuCell,
  SearchIcon,
};
