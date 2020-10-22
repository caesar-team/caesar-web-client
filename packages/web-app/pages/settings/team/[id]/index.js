import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useDispatch, batch, useSelector } from 'react-redux';
import { TeamContainer } from '@caesar/containers';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from '@caesar/components';

import { userDataSelector } from '@caesar/common/selectors/user';
import { initTeamSettings } from '@caesar/common/actions/workflow';
import { fetchTeamMembersRequest } from '@caesar/common/actions/entities/member';
import { memberTeamSelector } from '@caesar/common/selectors/entities/member';

const SettingsTeamPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;

  useEffect(() => {
    batch(() => {
      dispatch(initTeamSettings());
      dispatch(fetchTeamMembersRequest({ teamId: id }));
    });
  }, [dispatch]);

  const members = useSelector(state =>
    memberTeamSelector(state, { teamId: id }),
  );
  const userData = useSelector(userDataSelector);

  const shouldShowLoader = !userData || !members;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="Team" />
      <SettingsLayout>
        <>
          <SettingsSidebar />
          <TeamContainer user={userData} members={members} />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsTeamPage;
