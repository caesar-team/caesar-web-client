import React from 'react';
import { SettingsWrapper } from '@caesar/components';

export const Users = () => {
  const isLoading = false;
  const users = [];

  return (
    <SettingsWrapper isLoading={isLoading} title={`Users (${users.length})`}>
      <div>Users list</div>
    </SettingsWrapper>
  );
};
