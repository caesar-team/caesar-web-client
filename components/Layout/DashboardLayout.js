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
  withSearch,
  searchedText,
  onSearch,
  onClickReset,
  children,
  ...props
}) => (
  <LayoutConstructorStyled
    headerComponent={
      <PrimaryHeader
        user={user}
        withSearch={withSearch}
        searchedText={searchedText}
        onSearch={onSearch}
        onClickReset={onClickReset}
      />
    }
    {...props}
  >
    <ScrollLock>{children}</ScrollLock>
  </LayoutConstructorStyled>
);

export default DashboardLayout;
