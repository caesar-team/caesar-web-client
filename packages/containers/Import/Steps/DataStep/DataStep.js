import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { waitIdle } from '@caesar/common/utils/utils';
import {
  ITEM_DOCUMENT_TYPE,
  ITEM_CREDENTIALS_TYPE,
  KEY_CODES,
} from '@caesar/common/constants';
import {
  Input,
  Icon,
  Button,
  Select,
  Checkbox,
  DataTable,
  VirtualizedTableHOC,
} from '@caesar/components';

const Wrapper = styled.div`
  width: calc(100vw - 495px);
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-bottom: 10px;

  ${Input.InputField} {
    padding: 10px 0 10px 50px;
    background: ${({ theme }) => theme.color.white};

    &:hover {
      background: ${({ theme }) => theme.color.white};
    }
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.color.gallery};
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 0;
`;

const SelectedItems = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

const StyledSelect = styled(Select)`
  padding: 0;
  border-bottom: 0;
  margin: 0 20px;

  ${Select.ValueText} {
    font-size: 16px;
    margin-right: 20px;
    color: rgba(0, 0, 0, 0.87);
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  cursor: text;
  width: 100%;
  min-width: 100px;
`;

const SelectListWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
`;

const MoveToText = styled.div`
  font-size: 14px;
  margin-right: 20px;
`;

const DataTableStyled = styled(DataTable)`
  height: 400px;
`;

const capitalize = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const normalize = array =>
  array.reduce(
    (accumulator, curr, index) => ({ ...accumulator, [index]: curr }),
    {},
  );

const denormalize = object => Object.values(object);

const SEARCH_FIELDS = ['name'];

const VirtualizedTable = VirtualizedTableHOC(DataTableStyled);

class DataStep extends Component {
  state = this.prepareInitialState();

  filter = memoize((data, pattern) =>
    data.filter(row =>
      SEARCH_FIELDS.some(field => row[field].toLowerCase().includes(pattern)),
    ),
  );

  getColumns() {
    const { data, selectedRows } = this.state;
    const { headings } = this.props;

    const columns = Object.keys(headings);

    const firstColumn = {
      id: 'checkbox',
      accessor: '',
      width: 60,
      sortable: false,
      Cell: ({ original }) => (
        <Checkbox
          checked={!!selectedRows[original.index]}
          onChange={this.handleSelectRow(original.index)}
        />
      ),
      Header: props => (
        <Checkbox
          checked={props.data.length === denormalize(selectedRows).length}
          onChange={this.handleSelectAll}
        />
      ),
    };

    const lastColumn = {
      id: 'type',
      accessor: 'type',
      sortable: false,
      width: 180,
      Cell: cellInfo => {
        const {
          original: { login, pass },
        } = cellInfo;
        const isCredentialsDisabled = !login || !pass;
        const isDocumentDisabled = false;

        const options = [
          {
            value: ITEM_CREDENTIALS_TYPE,
            label: 'Password',
            isDisabled: isCredentialsDisabled,
          },
          {
            value: ITEM_DOCUMENT_TYPE,
            label: 'Secure Note',
            isDisabled: isDocumentDisabled,
          },
        ];

        return (
          <StyledSelect
            name="type"
            options={options}
            value={data[cellInfo.index][cellInfo.column.id]}
            onChange={this.handleChangeType(cellInfo.index)}
          />
        );
      },
      Header: 'Type',
    };

    const restColumns = columns.map(id => ({
      id,
      accessor: id,
      Header: capitalize(id),
      Cell: cellInfo => (
        <Cell
          contentEditable
          onBlur={this.handleBlurField(cellInfo.index, cellInfo.column.id)}
          onKeyDown={this.handleKeyDown(cellInfo.index, cellInfo.column.id)}
          dangerouslySetInnerHTML={{
            __html: data[cellInfo.index][cellInfo.column.id],
          }}
        />
      ),
    }));

    return [firstColumn, ...restColumns, lastColumn];
  }

  handleSearch = event => {
    event.preventDefault();

    const {
      target: { value },
    } = event;

    this.setState({
      filterText: value,
    });
  };

  handleSubmit = async () => {
    const { onSubmit } = this.props;
    const { selectedRows, listId } = this.state;

    this.setSubmitting(true);

    await waitIdle();

    onSubmit(listId, denormalize(selectedRows), this.setSubmitting);
  };

  handleSelectAll = event => {
    const { checked } = event.currentTarget;
    const { data } = this.state;

    this.setState({
      selectedRows: checked ? normalize(data) : [],
    });
  };

  handleSelectRow = rowIndex => event => {
    const { checked } = event.currentTarget;
    const { data, selectedRows } = this.state;

    let updatedData = null;

    if (checked) {
      const row = data.find((_, index) => index === rowIndex);

      updatedData = { ...selectedRows, [rowIndex]: row };
    } else {
      const { [rowIndex]: row, ...rest } = selectedRows;

      updatedData = rest;
    }

    this.setState({
      selectedRows: updatedData,
    });
  };

  handleChangeField = (index, columnId, value) => {
    this.setState(prevState => ({
      data: prevState.data.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [columnId]: value } : row,
      ),
      selectedRows: prevState.selectedRows[index]
        ? {
            ...prevState.selectedRows,
            [index]: {
              ...prevState.selectedRows[index],
              [columnId]: value,
            },
          }
        : prevState.selectedRows,
    }));
  };

  handleBlurField = (index, columnId) => event => {
    event.preventDefault();
    event.stopPropagation();

    const {
      target: { innerText, textContent },
    } = event;

    const value = innerText || textContent;

    this.handleChangeField(index, columnId, value);
  };

  handleKeyDown = (index, columnId) => event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      this.handleBlurField(index, columnId)(event);
    }
  };

  handleChangeType = index => (_, value) => {
    this.handleChangeField(index, 'type', value);
  };

  handleChangeTeamId = (_, value) => {
    this.setState(prevState => ({
      teamId: value,
      listId:
        prevState.teamId !== value
          ? this.props.teamsLists.find(({ id }) => id === value).lists[0].id
          : prevState.listId,
    }));
  };

  handleChangeListId = (_, value) => {
    this.setState({
      listId: value,
    });
  };

  setSubmitting = isSubmitting => {
    this.setState({
      isSubmitting,
    });
  };

  prepareInitialState() {
    return {
      teamId: this.props.teamsLists[0].id,
      listId: this.props.teamsLists[0].lists[0].id,
      filterText: '',
      selectedRows: normalize(this.props.data),
      data: this.props.data,
      isSubmitting: false,
    };
  }

  render() {
    const { teamsLists, onCancel } = this.props;
    const {
      data,
      selectedRows,
      filterText,
      teamId,
      listId,
      isSubmitting,
    } = this.state;

    const selectedRowsLength = denormalize(selectedRows).length;

    const teamOptions = teamsLists.map(({ id, name }) => ({
      value: id,
      label: name.toLowerCase(),
    }));

    const currentTeam = teamsLists.find(({ id }) => id === teamId);
    const currentTeamListsOptions = currentTeam.lists.map(({ id, label }) => ({
      value: id,
      label: label.toLowerCase(),
    }));

    const isButtonDisabled = isSubmitting || !selectedRowsLength;

    return (
      <Wrapper>
        <Title>Select items to import data into Caesar</Title>
        <SearchInput
          prefix={<StyledIcon name="search" width={18} height={18} />}
          placeholder="Search"
          onChange={this.handleSearch}
        />
        <VirtualizedTable
          data={this.filter(data, filterText)}
          showPagination={false}
          defaultPageSize={data.length}
          columns={this.getColumns()}
        />
        <SelectListWrapper>
          <MoveToText>Select team and list of importing:</MoveToText>
          <StyledSelect
            boxDirection="up"
            options={teamOptions}
            value={teamId}
            onChange={this.handleChangeTeamId}
          />
          <StyledSelect
            boxDirection="up"
            options={currentTeamListsOptions}
            value={listId}
            onChange={this.handleChangeListId}
          />
        </SelectListWrapper>
        <BottomWrapper>
          <SelectedItems>
            Selected items: {selectedRowsLength} / {data.length}
          </SelectedItems>
          <ButtonsWrapper>
            <StyledButton onClick={onCancel} disabled={isSubmitting}>
              CANCEL
            </StyledButton>
            <Button onClick={this.handleSubmit} disabled={isButtonDisabled}>
              IMPORT
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    );
  }
}

export default DataStep;
