import React from 'react';
import styled from 'styled-components';
import { Icon } from 'components';
import IconGoogle from 'static/images/svg/icon-google.svg';
import {
  API_URL,
  APP_URL,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
} from 'common/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #3d70ff;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 90px;
  border-radius: 2px;
`;

const NiceToMeetYouText = styled.div`
  font-size: 24px;
  color: #2e2f31;
  text-align: center;
  text-transform: uppercase;
`;

const WelcomeText = styled.div`
  font-size: 18px;
  color: #888b90;
  margin-top: 20px;
`;

const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 55px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border-radius: 2px;
`;

const AuthLink = styled.a`
  display: flex;
  align-items: center;
  padding: 20px 0;
  margin: 0 80px;
`;

const AuthText = styled.div`
  color: #2e2f31;
  font-size: 18px;
  margin-left: 20px;
`;

// TODO: Get endpoints configuration from the api server.
const authEndpoint = `${API_URL}/${AUTH_ENDPOINT}?redirect_uri=${APP_URL}/${REDIRECT_AUTH_ENDPOINT}`;

const AuthContainer = () => (
  <Wrapper>
    <InnerWrapper>
      <NiceToMeetYouText>Nice to meet you!</NiceToMeetYouText>
      <WelcomeText>Welcome to CaesarApp</WelcomeText>
      <AuthWrapper>
        <AuthLink href={authEndpoint}>
          <Icon component={IconGoogle} size={40} />
          <AuthText>Sign up via Google</AuthText>
        </AuthLink>
      </AuthWrapper>
    </InnerWrapper>
  </Wrapper>
);

export default AuthContainer;
