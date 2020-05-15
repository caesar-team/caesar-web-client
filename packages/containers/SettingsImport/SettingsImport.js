import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Layout, SettingsSidebar, Import } from '@caesar/components';

const MainWrapper = styled.div`
  display: flex;
`;

const SettingsImport = ({ user }) => (
  <Layout user={user}>
    <MainWrapper>
      <SettingsSidebar />
      <Import />
    </MainWrapper>
  </Layout>
);

export default withRouter(SettingsImport);
