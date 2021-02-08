import React, { useState, memo } from 'react';
import { useEffectOnce } from 'react-use';
import Router from 'next/router';
import styled from 'styled-components';
import {
  API_URI,
  APP_URI,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
  ROUTES,
} from '@caesar/common/constants';
import { ERROR } from '@caesar/common/validation';
import { isServer } from '@caesar/common/utils/isEnvironment';
import {
  Icon,
  AuthTitle,
  AuthDescription,
  TextWithLines,
  AuthLayout,
  SecondaryHeader,
  GlobalNotification,
} from '@caesar/components';
import { login } from '@caesar/common/utils/authUtils';
import { setCookieValue } from '@caesar/common/utils/token';
import SignInForm from './SignInForm';

const AuthWrapper = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  height: 60px;
  width: 100%;
  text-decoration: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.color.black};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.emperor};
  }
`;

const GoogleLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  width: 60px;
  height: 100%;
  color: ${({ theme }) => theme.color.white};
`;

const GoogleAuthText = styled.div`
  margin: auto;
  font-size: 18px;
  color: ${({ theme }) => theme.color.white};
`;

const headerComponent = <SecondaryHeader buttonText="Sign Up" url="/signup" />;

const generateGoogleAuthUrl = async () => {
  return `${API_URI}/${AUTH_ENDPOINT}?redirect_uri=${APP_URI}/${REDIRECT_AUTH_ENDPOINT}`;
};

const SignInContainerComponent = ({ error = null }) => {
  const [googleAuthError, setGoogleAuthError] = useState(error);
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  const isLinkShown = googleAuthUrl !== '';

  const handleSubmit = async (
    { email, password },
    { setSubmitting, setErrors },
  ) => {
    try {
      const jwt = await login(email, password);

      setCookieValue('token', jwt);

      Router.push(ROUTES.DASHBOARD);
    } catch (e) {
      setErrors({ password: ERROR.INCORRECT_CREDENTIALS });
      setSubmitting(false);
    }
  };

  useEffectOnce(() => {
    const generateAndSetGoogleAuthUrl = async () => {
      if (isServer) return;

      const url = await generateGoogleAuthUrl();

      if (googleAuthUrl === '') {
        setGoogleAuthUrl(url);
      }
    };

    generateAndSetGoogleAuthUrl();
  });

  const handleCloseNotification = () => {
    setGoogleAuthError(null);
    Router.push(ROUTES.SIGN_IN);
  };

  return (
    <AuthLayout headerComponent={headerComponent}>
      <AuthTitle>Nice to meet you!</AuthTitle>
      <AuthDescription>Welcome to Caesar.Team!</AuthDescription>
      <SignInForm onSubmit={handleSubmit} />
      {isLinkShown && (
        <>
          <TextWithLines width={1}>OR</TextWithLines>
          <AuthWrapper href={googleAuthUrl}>
            <GoogleLogoWrapper>
              <Icon name="google" width={20} height={20} />
            </GoogleLogoWrapper>
            <GoogleAuthText>Log in with Google</GoogleAuthText>
          </AuthWrapper>
        </>
      )}
      {googleAuthError && (
        <GlobalNotification
          text={googleAuthError}
          isError
          onClose={handleCloseNotification}
        />
      )}
    </AuthLayout>
  );
};

export const SignInContainer = memo(SignInContainerComponent);
