import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { Checkbox, DataTable } from 'components';
import {
  ITEM_DOCUMENT_TYPE,
  ITEM_CREDENTIALS_TYPE,
  KEY_CODES,
} from 'common/constants';
import { Input } from '../../../Input';
import { Icon } from '../../../Icon';
import { Button } from '../../../Button';
import { Select } from '../../../Select';

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

const EditableInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.gallery};

  ${Input.InputField} {
    font-size: 16px;
    padding: 6px 0;
    background: ${({ theme }) => theme.snow};
  }
`;

const capitalize = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SEARCH_FIELDS = ['title'];

const CellEditableComponent = ({
  index,
  fieldName,
  editableIndex,
  editableFieldName,
  onChange,
  onKeyEnter,
  onClick,
  ...props
}) => {
  const value = props[fieldName];
  const isEditMode = index === editableIndex && fieldName === editableFieldName;

  if (isEditMode) {
    return (
      <EditableInput value={value} onChange={onChange} onKeyDown={onKeyEnter} />
    );
  }

  return <Cell onClick={onClick(index, fieldName)}>{value}</Cell>;
};

const CellTypeComponent = ({ onSelect, index, type, login, password }) => {
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
      key={index}
      name="type"
      options={options}
      value={type}
      onChange={onSelect(index)}
    />
  );
};

class DataStep extends Component {
  state = this.prepareInitialState();

  filter = memoize((data, pattern) =>
    data.filter(row =>
      SEARCH_FIELDS.some(field => row[field].toLowerCase().includes(pattern)),
    ),
  );

  getColumns() {
    const columns = Object.keys(this.props.headings).map(heading => ({
      name: capitalize(heading),
      selector: heading,
      sortable: true,
      ignoreRowClick: true,
      cell: props => (
        <CellEditableComponent
          fieldName={heading}
          editableIndex={this.state.editableIndex}
          editableFieldName={this.state.editableFieldName}
          onChange={this.handleChangeField}
          onKeyEnter={this.handleFinishEdit}
          onClick={this.handleClickEditable}
          {...props}
        />
      ),
    }));

    return [
      ...columns,
      {
        cell: props => (
          <CellTypeComponent onSelect={this.handleSelectType} {...props} />
        ),
        name: 'Type',
        ignoreRowClick: true,
        allowOverflow: true,
      },
    ];
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

  handleUpdateTable = ({ selectedRows }) => {
    this.setState({
      selectedRows,
    });
  };

  handleSelectType = index => (name, value) => {
    this.setState(prevState => ({
      data: prevState.data.map(
        (row, rowIndex) => (rowIndex === index ? { ...row, type: value } : row),
      ),
    }));
  };

  handleClickEditable = (index, fieldName) => () => {
    this.setState({
      editableIndex: index,
      editableFieldName: fieldName,
    });
  };

  handleChangeField = event => {
    const {
      target: { value },
    } = event;

    const { editableIndex, editableFieldName } = this.state;

    this.setState(prevState => ({
      data: prevState.data.map(
        (row, rowIndex) =>
          rowIndex === editableIndex
            ? { ...row, [editableFieldName]: value }
            : row,
      ),
      selectedRows: prevState.selectedRows.filter(
        (_, index) => index !== editableIndex,
      ),
    }));
  };

  handleFinishEdit = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      this.setState({
        editableIndex: null,
        editableFieldName: null,
      });
    }
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { selectedRows } = this.state;

    onSubmit(selectedRows);
  };

  prepareInitialState() {
    return {
      filterText: '',
      selectedRows: [],
      data: this.props.data,
      editableIndex: null,
      editableFieldName: null,
    };
  }

  render() {
    const { data, selectedRows, filterText } = this.state;

    return (
      <Wrapper>
        <Title>Select items to import data into Caesar </Title>
        <SearchInput
          prefix={<StyledIcon name="search" width={18} height={18} />}
          placeholder="Search"
          onChange={this.handleSearch}
        />
        <DataTable
          noHeader
          columns={this.getColumns()}
          data={this.filter(data, filterText)}
          selectableRows
          selectableRowsComponent={Checkbox}
          onTableUpdate={this.handleUpdateTable}
        />
        <BottomWrapper>
          <SelectedItems>
            Selected items: {selectedRows.length} / {data.length}
          </SelectedItems>
          <ButtonsWrapper>
            <StyledButton>CANCEL</StyledButton>
            <Button onClick={this.handleSubmit} disabled={!selectedRows.length}>
              IMPORT
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    );
  }
}

export default DataStep;
