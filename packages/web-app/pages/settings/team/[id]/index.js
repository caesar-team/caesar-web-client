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
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { teamMembersFullViewSelector } from '@caesar/common/selectors/entities/member';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';

const SettingsTeamPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;

  useEffectOnce(() => {
    dispatch(initTeamSettings());
  });

  const isLoading = useSelector(isLoadingSelector);
  const team = useSelector(state => teamSelector(state, { teamId: id })) || {};
  const members = useSelector(state =>
    teamMembersFullViewSelector(state, { teamId: id }),
  );
  const currentUserData = useSelector(currentUserDataSelector);

  const shouldShowLoader = isLoading || !currentUserData || !team || !members;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="Team" />
      <SettingsLayout currentUser={currentUserData}>
        <>
          <SettingsSidebar />
          <TeamContainer
            currentUser={currentUserData}
            team={team}
            members={members}
          />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsTeamPage;
