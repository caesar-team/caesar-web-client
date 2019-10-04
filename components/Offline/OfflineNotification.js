import React from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import withOfflineDetection from './withOfflineDetection';

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.emperor};
  border-radius: 3px;
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.08);
  padding-top: 6px;
  padding-bottom: 6px;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.white};
  margin-right: 6px;
`;

const OfflineNotification = ({ isOnline }) =>
  !isOnline && (
    <Wrapper>
      <Text>You have lost connection</Text>
      <Icon name="warning" width={14} height={14} fill="#fff" />
    </Wrapper>
  );

export default withOfflineDetection(OfflineNotification);
