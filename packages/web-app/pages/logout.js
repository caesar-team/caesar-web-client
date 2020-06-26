import React from 'react';
import { useDispatch } from 'react-redux';
import { useIsomorphicLayoutEffect } from 'react-use';
import { logout } from '@caesar/common/actions/user';

export default () => {
  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(logout());
  });

  return null;
};
