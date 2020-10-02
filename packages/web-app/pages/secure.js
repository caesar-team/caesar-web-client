import React from 'react';
import styled from 'styled-components';
import { Head, SecureMessage, SecureLayout } from '@caesar/components';

const SecureMessageStyled = styled(SecureMessage)`
  height: auto;
`;

const SecurePage = () => (
  <>
    <Head title="Secure Message" />
    <SecureLayout>
      <SecureMessageStyled />
    </SecureLayout>
  </>
);

export default SecurePage;
