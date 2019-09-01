import React, { Fragment } from 'react';
import { Head, SettingsLayout, SettingsSidebar } from 'components';
import { ImportContainer } from 'containers';
import { isServer } from 'common/utils/isEnvironment';
import { getCookieValue } from 'common/utils/token';
import { getUserSelf } from 'common/api';

const SettingsImportPage = ({ user }) => (
  <Fragment>
    <Head title="Import" />
    <SettingsLayout user={user}>
      <Fragment>
        <SettingsSidebar />
        <ImportContainer />
      </Fragment>
    </SettingsLayout>
  </Fragment>
);

SettingsImportPage.getInitialProps = async ({ req }) => {
  try {
    const token = isServer ? req.cookies.token : getCookieValue('token');
    const { data: user } = await getUserSelf(token);

    return {
      user,
    };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default SettingsImportPage;
