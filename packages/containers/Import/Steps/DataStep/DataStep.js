import React, { useState, useMemo, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { waitIdle } from '@caesar/common/utils/utils';
import { TEAM_TYPE, LIST_TYPE } from '@caesar/common/constants';
import { Icon, DataTable } from '@caesar/components';
import {
  Title,
  SearchInput,
  BottomWrapper,
  SelectedItems,
  StyledButton,
  SelectListWrapper,
  MoveToText,
  StyledSelect,
  StyledTable,
} from './styles';
import { normalize, denormalize, filter } from './utils';
import { createColumns } from './createColumns';

const DataStep = ({
  data: propData,
  headings,
  teamsLists,
  onSubmit,
  onCancel,
}) => {
  const personalTeamIndex =
    teamsLists.findIndex(({ id }) => id === TEAM_TYPE.PERSONAL) || 0;

  const [state, setState] = useState({
    teamId: teamsLists[personalTeamIndex]?.id || null,
    listId: teamsLists[personalTeamIndex]?.lists[0]?.id || null,
    filterText: '',
    selectedRows: normalize(propData),
    data: propData,
    indexShownPassword: null,
    isSubmitting: false,
  });
  const {
    data,
    selectedRows,
    filterText,
    teamId,
    listId,
    isSubmitting,
  } = state;

  // Window height minus stuff that takes vertical place (including table headers)
  const tableVisibleDataHeight = window?.innerHeight - 575;
  const tableWrapperRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  useEffectOnce(() => {
    setTableWidth(tableWrapperRef?.current?.offsetWidth);
  });

  const tableData = useMemo(() => filter(data, filterText), [data, filterText]);
  const columns = useMemo(
    () => createColumns({ state, setState, headings, tableWidth }),
    [state, headings, tableWidth],
  );

  const selectedRowsLength = denormalize(selectedRows).length;
  const isButtonDisabled = isSubmitting || !selectedRowsLength;

  const teamOptions = teamsLists.flatMap(({ id, name }) =>
    id === TEAM_TYPE.PERSONAL
      ? {
          value: id,
          label: name.toLowerCase(),
        }
      : [],
  );

  const currentTeam = teamsLists.find(({ id }) => id === teamId);
  const currentTeamListsOptions = currentTeam.lists.flatMap(
    ({ type, id, label }) =>
      type === LIST_TYPE.INBOX
        ? []
        : {
            value: id,
            label: label.toLowerCase(),
          },
  );

  const handleSearch = event => {
    event.preventDefault();
    setState({
      ...state,
      filterText: event.target.value,
    });
  };

  const handleChangeTeamId = (_, value) => {
    setState({
      teamId: value,
      listId: teamsLists.find(({ id }) => id === value).lists[0].id,
    });
  };

  const handleChangeListId = (_, value) => {
    setState({
      ...state,
      listId: value,
    });
  };

  const setSubmitting = isSubmit => {
    setState({
      ...state,
      isSubmit,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await waitIdle();
    onSubmit(listId, denormalize(selectedRows), setSubmitting);
  };

  return (
    <>
      <Title>Select items to import data into Caesar</Title>
      <SearchInput
        prefix={<Icon name="search" width={16} height={16} color="gallery" />}
        placeholder="Search"
        onChange={handleSearch}
      />
      <StyledTable ref={tableWrapperRef}>
        <DataTable
          columns={columns}
          data={tableData}
          tableVisibleDataHeight={tableVisibleDataHeight}
        />
      </StyledTable>
      <SelectListWrapper>
        <MoveToText>Select list of importing:</MoveToText>
        <StyledSelect
          boxDirection="up"
          options={teamOptions}
          value={teamId}
          onChange={handleChangeTeamId}
        />
        <StyledSelect
          boxDirection="up"
          options={currentTeamListsOptions}
          value={listId}
          onChange={handleChangeListId}
        />
      </SelectListWrapper>
      <BottomWrapper>
        <SelectedItems>
          Selected items: {selectedRowsLength} / {data.length}
        </SelectedItems>
        <StyledButton color="white" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </StyledButton>
        <StyledButton onClick={handleSubmit} disabled={isButtonDisabled}>
          Import
        </StyledButton>
      </BottomWrapper>
    </>
  );
};

export { DataStep };
