import React, { Fragment } from 'react';
import { TeamListContainer } from 'containers';
import { Head, SettingsLayout, SettingsSidebar } from 'components';
import { isServer } from 'common/utils/isEnvironment';
import { getToken } from 'common/utils/token';
import { getUserSelf } from 'common/api';

const SettingsTeams = ({ user }) => (
  <Fragment>
    <Head title="Teams" />
    <SettingsLayout user={user}>
      <Fragment>
        <SettingsSidebar />
        <TeamListContainer />
      </Fragment>
    </SettingsLayout>
  </Fragment>
);

SettingsTeams.getInitialProps = async ({ req }) => {
  try {
    const token = isServer ? req.cookies.token : getToken();
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

export default SettingsTeams;
