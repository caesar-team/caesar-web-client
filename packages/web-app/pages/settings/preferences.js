import React from 'react';
import { useEffectOnce } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from '@caesar/components';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { PreferencesContainer } from '@caesar/containers/Preferences';
import { initPreferencesSettings } from '@caesar/common/actions/workflow';

const SettingsTeamPage = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(initPreferencesSettings());
  });

  const currentUserData = useSelector(currentUserDataSelector);

  const shouldShowLoader = !currentUserData;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="Preferences" />
      <SettingsLayout currentUser={currentUserData}>
        <>
          <SettingsSidebar />
          <PreferencesContainer currentUser={currentUserData} />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsTeamPage;
