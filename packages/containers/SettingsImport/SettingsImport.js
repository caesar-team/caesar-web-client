import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Layout, SettingsSidebar, Import } from '@caesar/components';

const MainWrapper = styled.div`
  display: flex;
`;

class SettingsImport extends Component {
  render() {
    const { user } = this.props;

    return (
      <Layout withSearch user={user}>
        <MainWrapper>
          <SettingsSidebar />
          <Import />
        </MainWrapper>
      </Layout>
    );
  }
}

export default withRouter(SettingsImport);
