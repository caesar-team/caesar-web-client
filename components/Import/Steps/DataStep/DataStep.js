import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { ITEM_DOCUMENT_TYPE, ITEM_CREDENTIALS_TYPE } from 'common/constants';
import { Input } from '../../../Input';
import { Icon } from '../../../Icon';
import { Button } from '../../../Button';
import { Select } from '../../../Select';
import { Checkbox } from '../../../Checkbox';
import { DataTable } from '../../../DataTable';

const Wrapper = styled.div`
  width: calc(100vw - 480px);
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.gallery};
  margin-bottom: 10px;

  ${Input.InputField} {
    padding: 10px 0 10px 50px;
    background: ${({ theme }) => theme.white};

    &:hover {
      background: ${({ theme }) => theme.white};
    }
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gallery};
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
  letter-spacing: 0.4px;
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
  cursor: text;
  max-width: 100%;
  min-width: 100px;
`;

const capitalize = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SEARCH_FIELDS = ['title'];

const normalize = array =>
  array.reduce(
    (accumulator, curr, index) => ({ ...accumulator, [index]: curr }),
    {},
  );

const denormalize = object => Object.values(object);

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
          onChange={this.handleSelectRow(original.index.toString())}
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
          original: { login, password },
        } = cellInfo;
        const isCredentialsDisabled = !login || !password;
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

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { selectedRows } = this.state;

    onSubmit(denormalize(selectedRows));
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
      data: prevState.data.map(
        (row, rowIndex) =>
          rowIndex === index ? { ...row, [columnId]: value } : row,
      ),
      selectedRows: {
        ...prevState.selectedRows,
        [index]: {
          ...prevState.selectedRows[index],
          [columnId]: value,
        },
      },
    }));
  };

  handleBlurField = (index, columnId) => event => {
    const {
      target: { innerText, textContent },
    } = event;

    const value = innerText || textContent;

    this.handleChangeField(index, columnId, value);
  };

  handleChangeType = index => (_, value) => {
    this.handleChangeField(index, 'type', value);
  };

  prepareInitialState() {
    return {
      filterText: '',
      selectedRows: normalize(this.props.data),
      data: this.props.data,
    };
  }

  render() {
    const { data, selectedRows, filterText } = this.state;

    const selectedRowsLength = denormalize(selectedRows).length;

    return (
      <Wrapper>
        <Title>Select items to import data into Caesar </Title>
        <SearchInput
          prefix={<StyledIcon name="search" width={18} height={18} />}
          placeholder="Search"
          onChange={this.handleSearch}
        />
        <DataTable
          data={this.filter(data, filterText)}
          showPagination={false}
          defaultPageSize={data.length}
          columns={this.getColumns()}
        />
        <BottomWrapper>
          <SelectedItems>
            Selected items: {selectedRowsLength} / {data.length}
          </SelectedItems>
          <ButtonsWrapper>
            <StyledButton>CANCEL</StyledButton>
            <Button onClick={this.handleSubmit} disabled={!selectedRowsLength}>
              IMPORT
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    );
  }
}

export default DataStep;
