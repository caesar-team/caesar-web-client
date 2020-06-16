import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import ScrollLock from 'react-scrolllock';
import { DASHBOARD_MODE, ITEM_MODE } from '@caesar/common/constants';
import {
  userDataSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import { workInProgressListSelector } from '@caesar/common/selectors/workflow';
import {
  setWorkInProgressItem,
  setWorkInProgressListId,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { initialItemData } from '@caesar/containers/Dashboard/utils';
import LayoutConstructor from './LayoutConstructor';
import { PrimaryHeader } from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
  overflow: hidden;
`;

export const DashboardLayout = ({
  searchedText,
  setSearchedText,
  setMode,
  children,
  ...props
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const team = useSelector(currentTeamSelector);
  const workInProgressList = useSelector(workInProgressListSelector);

  const handleSearch = event => {
    event.preventDefault();

    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressListId(null));
    dispatch(setWorkInProgressItem(null));

    setSearchedText(event.target.value);
    setMode(
      event.target.value ? DASHBOARD_MODE.SEARCH : DASHBOARD_MODE.DEFAULT,
    );
  };

  const handleClickResetSearch = () => {
    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressListId(null));
    dispatch(setWorkInProgressItem(null));

    setSearchedText('');
    setMode(DASHBOARD_MODE.DEFAULT);
  };

  const handleClickCreateItem = (name, type) => {
    dispatch(resetWorkInProgressItemIds());
    dispatch(
      setWorkInProgressItem(
        initialItemData(type, workInProgressList.id),
        ITEM_MODE.WORKFLOW_CREATE,
      ),
    );
  };

  return (
    <LayoutConstructorStyled
      headerComponent={
        <PrimaryHeader
          user={user}
          team={team}
          searchedText={searchedText}
          onSearch={handleSearch}
          onClickReset={handleClickResetSearch}
          workInProgressList={workInProgressList}
          onClickCreateItem={handleClickCreateItem}
        />
      }
      {...props}
    >
      <ScrollLock>{children}</ScrollLock>
    </LayoutConstructorStyled>
  );
};

export default DashboardLayout;
