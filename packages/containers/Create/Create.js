import React from 'react';
import { useEffectOnce } from 'react-use';
import { useDispatch } from 'react-redux';
import { initCreatePage } from '@caesar/common/actions/workflow';
import { CreateLayout, CreateForm } from '@caesar/components';

export const Create = () => {
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(initCreatePage());
  });

  return (
    <CreateLayout>
      <CreateForm />
    </CreateLayout>
  );
};
