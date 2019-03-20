import React, { Fragment } from 'react';
import { ManageListContainer } from 'containers';
import { Head, SettingsLayout, SettingsSidebar } from 'components';
import { isServer } from 'common/utils/isEnvironment';
import { getToken } from 'common/utils/token';
import { getUserSelf } from 'common/api';

const SettingsManageList = ({ user }) => (
  <Fragment>
    <Head title="List Management" />
    <SettingsLayout user={user}>
      <Fragment>
        <SettingsSidebar />
        <ManageListContainer />
      </Fragment>
    </SettingsLayout>
  </Fragment>
);

SettingsManageList.getInitialProps = async ({ req }) => {
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

export default SettingsManageList;
