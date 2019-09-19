import React from 'react';
import styled from 'styled-components';
import { CircleLoader } from '../Loader';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  background-color: ${({ theme }) => theme.emperor};
  position: absolute;
  bottom: 10px;
  right: 60px;
  z-index: 11;
  border-radius: 3px;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.white};
  margin-left: 20px;
`;

const LoadingNotification = ({
  text = 'Your request is in progress...',
  className,
}) => (
  <Wrapper className={className}>
    <CircleLoader size={16} color="white" />
    <Text>{text}</Text>
  </Wrapper>
);

export default LoadingNotification;
