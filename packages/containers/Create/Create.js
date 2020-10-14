import React from 'react';
import { useEffectOnce } from 'react-use';
import { useDispatch, batch } from 'react-redux';
import { initCreatePage } from '@caesar/common/actions/workflow';
import { CreateLayout, CreateForm } from '@caesar/components';
import { fetchUserSelfRequest } from '@caesar/common/actions/user';

export const Create = () => {
  const dispatch = useDispatch();

  useEffectOnce(() => {
    batch(() => {
      dispatch(fetchUserSelfRequest());
      dispatch(initCreatePage());
    });
  });

  return (
    <CreateLayout>
      <CreateForm />
    </CreateLayout>
  );
};
