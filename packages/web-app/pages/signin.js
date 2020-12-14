import React from 'react';
import { SignInContainer } from '@caesar/containers';
import { Head } from '@caesar/components';

const SignInPage = ({ error }) => (
  <>
    <Head title="Sign In" />
    <SignInContainer error={error} />
  </>
);

SignInPage.getInitialProps = ({ query }) => {
  const { error = '' } = query;

  return { error };
};

export default SignInPage;
