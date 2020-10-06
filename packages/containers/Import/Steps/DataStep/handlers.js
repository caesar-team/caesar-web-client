import { KEY_CODES } from '@caesar/common/constants';
import { normalize } from './utils';

export const handleSelectAll = ({ state, setState }) => event => {
  const { checked } = event.currentTarget;
  const { data } = state;

  setState({
    ...state,
    selectedRows: checked ? normalize(data) : [],
  });
};

export const handleSelectRow = ({ rowIndex, state, setState }) => event => {
  const { checked } = event.currentTarget;
  const { data, selectedRows } = state;

  let updatedData = null;

  if (checked) {
    const row = data.find((_, index) => index === rowIndex);

    updatedData = { ...selectedRows, [rowIndex]: row };
  } else {
    const { [rowIndex]: row, ...rest } = selectedRows;

    updatedData = rest;
  }

  setState({
    ...state,
    selectedRows: updatedData,
  });
};

export const handleChangeField = ({
  index,
  columnId,
  value,
  state,
  setState,
}) => {
  setState({
    ...state,
    data: state.data.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [columnId]: value } : row,
    ),
    selectedRows: state.selectedRows[index]
      ? {
          ...state.selectedRows,
          [index]: {
            ...state.selectedRows[index],
            [columnId]: value,
          },
        }
      : state.selectedRows,
  });
};

export const handleChangeType = ({ index, state, setState }) => (_, value) => {
  handleChangeField({ index, columnId: 'type', value, state, setState });
};

export const handleBlurField = ({
  index,
  columnId,
  state,
  setState,
}) => event => {
  event.preventDefault();
  event.stopPropagation();

  const {
    target: { innerText, textContent },
  } = event;

  const value = innerText || textContent;

  handleChangeField({ index, columnId, value, state, setState });
};

export const handleKeyDown = ({
  index,
  columnId,
  state,
  setState,
}) => event => {
  if (event.keyCode === KEY_CODES.ENTER) {
    handleBlurField({ index, columnId, state, setState })(event);
  }
};

export const handleClickEyeIcon = ({ index, state, setState }) => {
  setState({
    ...state,
    indexShownPassword: index === state.indexShownPassword ? null : index,
  });
};
