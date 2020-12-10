import styled from 'styled-components';
import {
  Input,
  Icon,
  Button,
  Select,
  TableStyles as Table,
} from '@caesar/components';

export const Title = styled.div`
  margin-bottom: 12px;
  font-weight: 600;
`;

export const SearchInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-bottom: 8px;

  ${Input.InputField} {
    padding-left: 48px;
    background: ${({ theme }) => theme.color.white};
  }
`;

export const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SelectedItems = styled.div`
  margin-right: auto;
  font-size: ${({ theme }) => theme.font.size.small};
  font-weight: 600;
`;

export const StyledButton = styled(Button)`
  margin-left: 16px;
`;

export const SelectListWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0 0;
`;

export const MoveToText = styled.div`
  margin-right: 8px;
`;

export const StyledSelect = styled(Select)`
  padding: 0;
  margin: 0 8px;
  border-bottom: 0;

  ${Select.ValueText} {
    padding: 0;
    margin-right: 16px;
  }
`;

export const StyledListSelect = styled(Select)`
  ${Select.Option} {
    white-space: normal;
    word-break: break-word;
  }
`;

export const TypeSelect = styled(StyledSelect)`
  margin: 0;

  ${Select.ValueText} {
    margin-right: 0;
  }
`;

export const StyledTable = styled(Table.Main)`
  .table {
    border: 1px solid ${({ theme }) => theme.color.gallery};
    border-radius: ${({ theme }) => theme.borderRadius};

    .th,
    .td {
      padding: 8px;
    }

    .thead .tr {
      padding: 8px 0;
      margin: 0;
      color: ${({ theme }) => theme.color.gray};
      background-color: ${({ theme }) => theme.color.snow};
      border-bottom: none;
    }

    .tbody .td {
      margin-bottom: 0;
    }
  }
`;

export const CellWrapper = styled.div`
  position: relative;
  width: 100%;

  ${({ isPassword }) =>
    isPassword &&
    `
    padding-right: 24px;
  `}
`;

export const Cell = styled.div`
  width: 100%;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  cursor: ${({ isEditableStyles }) =>
    isEditableStyles ? 'text' : 'not-allowed'};
`;

export const EyeIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;
