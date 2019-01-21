import React from 'react';
import styled, { withTheme } from 'styled-components';
import {
  API_URL,
  APP_URL,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
} from 'common/constants';
import { Icon, AuthTitle } from 'components';
import AuthDescription from '../../components/AuthDescription/AuthDescription';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: ${({ theme }) => theme.white};
`;

const IconWrapper = styled.div`
  display: flex;
  margin-bottom: 100px;
`;

const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  height: 70px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.black};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.emperor};
  }
`;

const GoogleLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  width: 70px;
  height: 100%;
`;

const AuthText = styled.div`
  padding: 20px 0;
  margin: 0 60px 0 50px;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.white};
`;

// TODO: Get endpoints configuration from the api server.
const authEndpoint = `${API_URL}/${AUTH_ENDPOINT}?redirect_uri=${APP_URL}/${REDIRECT_AUTH_ENDPOINT}`;

const AuthContainer = ({ theme }) => (
  <Wrapper>
    <IconWrapper>
      <Icon name="logo" height={45} />
    </IconWrapper>
    <AuthTitle>Nice to meet you!</AuthTitle>
    <AuthDescription>Welcome to Caesar</AuthDescription>
    <AuthWrapper href={authEndpoint}>
      <GoogleLogoWrapper>
        <Icon name="google" width={25} height={25} fill={theme.white} />
      </GoogleLogoWrapper>
      <AuthText>Sign in via Google</AuthText>
    </AuthWrapper>
  </Wrapper>
);

export default withTheme(AuthContainer);
