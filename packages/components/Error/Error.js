import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ErrorLayout, Head, SecureLayout } from '@caesar/components';
import ErrorImg from '@caesar/assets/images/error.jpg';
import ErrorImg2x from '@caesar/assets/images/error@2x.jpg';

const Image = styled.img`
  object-fit: contain;
`;
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
  z-index: 0;
`;

const StatusCode = styled.div`
  font-size: 36px;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 18px;
`;

const Error = ({ statusCode }) => (
  <Fragment>
    <Head title="Secure Message" />
    <ErrorLayout>
      <Image src={ErrorImg} srcSet={`${ErrorImg} 1x, ${ErrorImg2x} 2x`} />
      <TextWrapper>
        <StatusCode>{statusCode}</StatusCode>
        <Description>Oops… Something went wrong</Description>
      </TextWrapper>
    </ErrorLayout>
  </Fragment>
);

export default Error;
