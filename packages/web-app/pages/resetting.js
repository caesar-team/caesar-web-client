import React from 'react';
import { Head } from '@caesar/components';
import { ResetPasswordContainer } from '@caesar/containers';

const ResettingPage = ({ email, token }) => (
  <>
    <Head title="Reset Password" />
    <ResetPasswordContainer email={email} token={token} />
  </>
);

ResettingPage.getInitialProps = ({ query: { email, token } }) => ({
  email,
  token,
});

export default ResettingPage;
