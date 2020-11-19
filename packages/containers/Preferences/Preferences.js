/* eslint-disable camelcase */
import React from 'react';
import { Button, SettingsWrapper } from '@caesar/components';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { resetApplicationCache } from '@caesar/common/actions/application';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const ResetCacheButton = styled(ButtonStyled)`
  margin-right: 0;
`;

export const PreferencesContainer = ({ currentUser }) => {
  const dispatch = useDispatch();

  const handleClearCache = () => {
    if (confirm('Do you really want to clear app cache?')) {
      dispatch(resetApplicationCache());
    }
  };

  return (
    <SettingsWrapper
      title="Preferences"
      addonTopComponent={
        <>
          <ResetCacheButton
            onClick={handleClearCache}
            icon="update"
            color="black"
          >
            Reset Application Cache
          </ResetCacheButton>
        </>
      }
    >
      <>¯\_(ツ)_/¯</>
    </SettingsWrapper>
  );
};
