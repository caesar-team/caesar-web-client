/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { resetApplicationCache } from '@caesar/common/actions/application';
import { Button, SettingsWrapper } from '@caesar/components';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const ResetCacheButton = styled(ButtonStyled)`
  align-self: flex-start;
  margin-right: 0;
`;

export const PreferencesContainer = () => {
  const dispatch = useDispatch();

  const handleClearCache = () => {
    if (confirm('Do you really want to clear app cache?')) {
      dispatch(resetApplicationCache());
    }
  };

  return (
    <SettingsWrapper title="Preferences">
      <ResetCacheButton onClick={handleClearCache} icon="update" color="black">
        Reset Application Cache
      </ResetCacheButton>
    </SettingsWrapper>
  );
};
