import React, { Fragment } from 'react';
import { TeamListContainer } from 'containers';
import { Head, SettingsLayout, SettingsSidebar } from 'components';
import { getUserWithTeam } from 'common/utils/entryResolver';

const SettingsTeams = ({ user, team }) => (
  <Fragment>
    <Head title="Teams" />
    <SettingsLayout user={user} team={team}>
      <Fragment>
        <SettingsSidebar />
        <TeamListContainer />
      </Fragment>
    </SettingsLayout>
  </Fragment>
);

SettingsTeams.getInitialProps = async ({ req }) => {
  try {
    const { user, team } = await getUserWithTeam(req);

    console.log('SettingsTeams', user, team);

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

export default SettingsTeams;
