import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { ErrorLayout } from '@caesar/components';

const TextWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatusCode = styled.div`
  font-size: ${({ theme }) => theme.font.size.large};
  text-align: center;
  margin-bottom: 10px;

  ${media.desktop`
    font-size: ${({ theme }) => theme.font.size.big};
  `}
  
  ${media.mobile`
    font-size: ${({ theme }) => theme.font.size.middle};
  `}
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.font.size.main};
`;

const Error = ({ statusCode }) => (
  <ErrorLayout>
    <TextWrapper>
      <StatusCode>{statusCode}</StatusCode>
      <Description>Ooops… Something went wrong</Description>
    </TextWrapper>
  </ErrorLayout>
);

export default Error;
