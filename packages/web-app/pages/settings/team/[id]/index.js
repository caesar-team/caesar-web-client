import React from 'react';
import { useEffectOnce } from 'react-use';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { TeamContainer } from '@caesar/containers';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from '@caesar/components';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { initTeamSettings } from '@caesar/common/actions/workflow';
import { teamMembersSelector } from '@caesar/common/selectors/entities/member';

const SettingsTeamPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;

  useEffectOnce(() => {
    dispatch(initTeamSettings());
  });

  const members = useSelector(state =>
    teamMembersSelector(state, { teamId: id }),
  );
  const currentUserData = useSelector(currentUserDataSelector);

  const shouldShowLoader = !currentUserData || !members;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="Team" />
      <SettingsLayout currentUser={currentUserData}>
        <>
          <SettingsSidebar />
          <TeamContainer currentUser={currentUserData} members={members} />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsTeamPage;
