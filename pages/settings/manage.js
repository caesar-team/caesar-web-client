import React, { Fragment } from 'react';
import { ManageListContainer } from 'containers';
import { Head, SettingsLayout, SettingsSidebar } from 'components';
import { getUserWithTeam } from 'common/utils/entryResolver';

const SettingsManageList = ({ user, team }) => (
  <Fragment>
    <Head title="List Management" />
    <SettingsLayout user={user} team={team}>
      <Fragment>
        <SettingsSidebar />
        <ManageListContainer />
      </Fragment>
    </SettingsLayout>
  </Fragment>
);

SettingsManageList.getInitialProps = async ({ req }) => {
  try {
    const { user, team } = await getUserWithTeam(req);

    console.log('SettingsManageList', user, team);
    return {
      user,
      team,
    };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default SettingsManageList;
