import React, { memo } from 'react';
import Router from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import {
  AuthTitle,
  AuthDescription,
  AuthLayout,
  SecondaryHeader,
} from '@caesar/components';
import { useNotification } from '@caesar/common/hooks';
import { registration } from '@caesar/common/utils/authUtils';
import { getServerErrorsByName } from '@caesar/common/utils/error';
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
        text:
          'You will recieve a registration link via email. Please check your Inbox',
        options: {
          timeout: 10000,
        },
      });

      Router.push(ROUTES.SIGN_IN);
    } catch (e) {
      const serverErrorsByName = getServerErrorsByName(e);

      setErrors(serverErrorsByName);
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

export default memo(SignUpContainer);
