import React from 'react';
import { useEffectOnce } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import {
  FullScreenLoader,
  Head,
  SettingsLayout,
  SettingsSidebar,
} from '@caesar/components';
import { UsersContainer } from '@caesar/containers';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { initUsersSettings } from '@caesar/common/actions/workflow';

const SettingsUsersPage = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(currentUserDataSelector);

  useEffectOnce(() => {
    dispatch(initUsersSettings());
  });

  const shouldShowLoader = !currentUserData;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="All users" />
      <SettingsLayout currentUser={currentUserData}>
        <>
          <SettingsSidebar />
          <UsersContainer />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsUsersPage;
