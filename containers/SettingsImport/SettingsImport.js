import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { SettingsLayout, SettingsSidebar, Import } from 'components';

const MainWrapper = styled.div`
  display: flex;
`;

class SettingsImport extends Component {
  render() {
    const { user } = this.props;

    return (
      <SettingsLayout user={user}>
        <MainWrapper>
          <SettingsSidebar />
          <Import />
        </MainWrapper>
      </SettingsLayout>
    );
  }
}

export default withRouter(SettingsImport);
