import React, { PureComponent } from 'react';
import styled from 'styled-components';
import withOfflineDetection from './withOfflineDetection';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: ${({ theme }) => theme.black};
  position: relative;
  border-radius: 3px;
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.08);
`;

class OfflineNotification extends PureComponent {
  render() {
    return this.props.isOnline && <Wrapper>You have lost connection</Wrapper>;
  }
}

export default withOfflineDetection(OfflineNotification);
