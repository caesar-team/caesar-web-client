import React, { memo } from 'react';
import { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import {
  AuthTitle,
  AuthDescription,
  AuthLayout,
  SecondaryHeader,
} from '@caesar/components';
import { useNotification } from '@caesar/common/hooks';
import { registration } from '@caesar/common/utils/authUtils';
import SignUpForm from './SignUpForm';

const headerComponent = <SecondaryHeader buttonText="Sign In" url="/signin" />;

const SignUpContainer = () => {
  const notification = useNotification();

  const handleSubmit = async (
    { email, password },
    { setSubmitting, setErrors },
  ) => {
    try {
      await registration(email, password);

      notification.show({
        text: 'You have successfully signed up',
      });

      Router.push(ROUTES.SIGN_IN);
    } catch (e) {
      setErrors({
        email: 'Wrong email',
        password: 'Wrong password',
        confirmPassword: 'Wrong password',
      });
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout headerComponent={headerComponent}>
      <AuthTitle>Nice to meet you!</AuthTitle>
      <AuthDescription>Welcome to Caesar.Team!</AuthDescription>
      <SignUpForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
};

export default withTheme(withRouter(memo(SignUpContainer)));
