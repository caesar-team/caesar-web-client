import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import withOfflineDetection from './withOfflineDetection';

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-weight: 600;
  color: ${({ isOnLightBg, theme }) =>
    isOnLightBg ? theme.color.white : theme.color.black};
  background-color: ${({ isOnLightBg, theme }) =>
    isOnLightBg ? theme.color.emperor : theme.color.alto};
`;

const Text = styled.div`
  margin-right: 8px;
`;

const OfflineNotification = ({ isOnline, isOnLightBg = true }) =>
  !isOnline && (
    <Wrapper isOnLightBg={isOnLightBg}>
      <Text>You are currently offline.</Text>
      <Icon
        name="warning"
        width={20}
        height={20}
        color={isOnLightBg ? 'white' : 'black'}
      />
    </Wrapper>
  );

export default withOfflineDetection(OfflineNotification);
