import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Head, SecureMessage, SecureLayout } from '@caesar/components';

const SecureMessageStyled = styled(SecureMessage)`
  height: auto;
`;

export default () => (
  <Fragment>
    <Head title="Secure Message" />
    <SecureLayout>
      <SecureMessageStyled />
    </SecureLayout>
  </Fragment>
);
