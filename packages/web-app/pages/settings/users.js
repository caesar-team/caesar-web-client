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
import { userDataSelector } from '@caesar/common/selectors/user';
import { initUsersSettings } from '@caesar/common/actions/workflow';

const SettingsUsersPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);

  useEffectOnce(() => {
    dispatch(initUsersSettings());
  });

  const shouldShowLoader = !userData;

  if (shouldShowLoader) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head title="All users" />
      <SettingsLayout user={userData}>
        <>
          <SettingsSidebar />
          <UsersContainer />
        </>
      </SettingsLayout>
    </>
  );
};

export default SettingsUsersPage;
