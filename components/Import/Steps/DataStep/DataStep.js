import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import {
  ITEM_DOCUMENT_TYPE,
  ITEM_CREDENTIALS_TYPE,
  KEY_CODES,
} from 'common/constants';
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

// const CellEditableComponent = ({
//   index,
//   fieldName,
//   editableIndex,
//   editableFieldName,
//   onChange,
//   onKeyEnter,
//   onClick,
//   ...props
// }) => {
//   const value = props[fieldName];
//   const isEditMode = index === editableIndex && fieldName === editableFieldName;
//
//   if (isEditMode) {
//     return (
//       <EditableInput value={value} onChange={onChange} onKeyDown={onKeyEnter} />
//     );
//   }
//
//   return <Cell onClick={onClick(index, fieldName)}>{value}</Cell>;
// };

// const CellTypeComponent = ({ onSelect, index, type, login, password }) => {
//   const isCredentialsDisabled = !login || !password;
//   const isDocumentDisabled = false;
//
//   const options = [
//     {
//       value: ITEM_CREDENTIALS_TYPE,
//       label: 'Password',
//       isDisabled: isCredentialsDisabled,
//     },
//     {
//       value: ITEM_DOCUMENT_TYPE,
//       label: 'Secure Note',
//       isDisabled: isDocumentDisabled,
//     },
//   ];
//
//   return (
//     <StyledSelect
//       key={index}
//       name="type"
//       options={options}
//       value={type}
//       onChange={onSelect(index)}
//     />
//   );
// };

const options = [
  {
    value: ITEM_CREDENTIALS_TYPE,
    label: 'Password',
    isDisabled: false,
  },
  {
    value: ITEM_DOCUMENT_TYPE,
    label: 'Secure Note',
    isDisabled: false,
  },
];

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

  getColumns() {}

  handleSearch = event => {
    event.preventDefault();

    const {
      target: { value },
    } = event;

    this.setState({
      filterText: value,
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

  handleChangeType = props => {
    console.log('handleChangeType', props);
  };

  prepareInitialState() {
    return {
      filterText: '',
      selectedRows: normalize(this.props.data),
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
          data={data}
          showPagination={false}
          defaultPageSize={data.length}
          columns={[
            {
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
                  checked={
                    props.data.length === denormalize(selectedRows).length
                  }
                  onChange={this.handleSelectAll}
                />
              ),
            },
            {
              Header: 'Title',
              id: 'title',
              accessor: 'title',
            },
            {
              Header: 'Login',
              accessor: 'login',
            },
            {
              Header: 'Password',
              accessor: 'password',
            },
            {
              Header: 'Website',
              accessor: 'website',
            },
            {
              Header: 'Note',
              accessor: 'note',
            },
            {
              id: 'type',
              accessor: 'type',
              sortable: false,
              width: 160,
              Cell: props => (
                // console.log(props);

                <StyledSelect
                  name="type"
                  options={options}
                  value={ITEM_CREDENTIALS_TYPE}
                  onChange={this.handleChangeType}
                />
              ),
              Header: 'Type',
            },
          ]}
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
