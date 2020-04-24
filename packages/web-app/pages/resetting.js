import React, { Fragment } from 'react';
import { Head } from '@caesar/components';
import { ResetPasswordContainer } from '@caesar/containers';

const ResettingPage = ({ email, token }) => (
  <Fragment>
    <Head title="Reset Password" />
    <ResetPasswordContainer email={email} token={token} />
  </Fragment>
);

ResettingPage.getInitialProps = ({ query: { email, token } }) => ({
  email,
  token,
});

export default ResettingPage;
