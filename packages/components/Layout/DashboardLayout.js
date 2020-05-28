import React from 'react';
import styled from 'styled-components';
import ScrollLock from 'react-scrolllock';
import LayoutConstructor from './LayoutConstructor';
import { PrimaryHeader } from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
  overflow: hidden;
`;

const DashboardLayout = ({
  user,
  team,
  searchedText,
  onSearch,
  onClickReset,
  workInProgressList,
  onClickCreateItem,
  children,
  ...props
}) => (
  <LayoutConstructorStyled
    headerComponent={
      <PrimaryHeader
        user={user}
        team={team}
        searchedText={searchedText}
        onSearch={onSearch}
        onClickReset={onClickReset}
        workInProgressList={workInProgressList}
        onClickCreateItem={onClickCreateItem}
      />
    }
    {...props}
  >
    <ScrollLock>{children}</ScrollLock>
  </LayoutConstructorStyled>
);

export default DashboardLayout;
