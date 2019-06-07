import React from 'react';
import styled from 'styled-components';
import { ErrorLayout } from 'components';
import ErrorImg from 'public/images/error.jpg';
import ErrorImg2x from 'public/images/error@2x.jpg';

const Image = styled.img`
  object-fit: contain;
`;

const TextWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatusCode = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
`;

const Error = ({ statusCode }) => (
  <ErrorLayout>
    <Image src={ErrorImg} srcSet={`${ErrorImg} 1x, ${ErrorImg2x} 2x`} />
    <TextWrapper>
      <StatusCode>{statusCode}</StatusCode>
      <Description>Oops… Something went wrong</Description>
    </TextWrapper>
  </ErrorLayout>
);

export default Error;
