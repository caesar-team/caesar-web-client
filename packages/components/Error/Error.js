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
  font-size: 36px;
  text-align: center;
  margin-bottom: 10px;

  ${media.desktop`
    font-size: 30px;
  `}
  
  ${media.narrowMobile`
    font-size: 24px;
  `}
`;

const Description = styled.div`
  font-size: 18px;

  ${media.desktop`
    font-size: 16px;
  `}
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
