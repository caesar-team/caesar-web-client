import React, { Fragment } from 'react';
import { Head } from 'components';
import { ResetPasswordContainer } from 'containers';

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
