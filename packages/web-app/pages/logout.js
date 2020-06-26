import React from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { useDispatch } from 'react-redux';
import { logout } from '@caesar/common/actions/user';

export default () => {
  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(logout());
  });

  return null;
};
