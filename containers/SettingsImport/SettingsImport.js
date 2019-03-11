import React, { Fragment } from 'react';
import { SettingsLayout, SettingsSidebar, Import } from 'components';

const SettingsImport = ({ user }) => (
  <SettingsLayout user={user}>
    <Fragment>
      <SettingsSidebar />
      <Import />
    </Fragment>
  </SettingsLayout>
);

export default SettingsImport;
