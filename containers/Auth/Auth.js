import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import {
  API_URL,
  APP_URL,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
} from 'common/constants';
import { isServer } from 'common/utils/isEnvironment';
import { Icon, AuthTitle, AuthDescription } from 'components';
import { getTrustedDeviceToken } from 'common/utils/token';

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

const AuthWrapper = styled.a`
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
  color: ${({ theme }) => theme.white};
`;

const AuthText = styled.div`
  padding: 20px 0;
  margin: 0 60px 0 50px;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.white};
`;

class AuthContainer extends Component {
  state = {
    url: '',
  };

  async componentDidMount() {
    if (isServer) return;
    const url = await this.generateUrl();
    if (this.state.url === '') {
      this.setState({ url });
    }
  }

  generateUrl = async () => {
    const deviceToken = await getTrustedDeviceToken(true);
    return `${API_URL}/${AUTH_ENDPOINT}?redirect_uri=${APP_URL}/${REDIRECT_AUTH_ENDPOINT}&fingerprint=${deviceToken}`;
  };

  render() {
    const { url } = this.state;
    const isLinkShown = url !== '';

    return (
      <Wrapper>
        <IconWrapper>
          <Icon name="logo" height={45} />
        </IconWrapper>
        <AuthTitle>Nice to meet you!</AuthTitle>
        <AuthDescription>Welcome to Caesar</AuthDescription>
        {isLinkShown && (
          <AuthWrapper href={url}>
            <GoogleLogoWrapper>
              <Icon name="google" width={25} height={25} isInButton />
            </GoogleLogoWrapper>
            <AuthText>Sign in via Google</AuthText>
          </AuthWrapper>
        )}
      </Wrapper>
    );
  }
}

export default withTheme(AuthContainer);
