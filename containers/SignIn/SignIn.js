import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import {
  API_URI,
  APP_URI,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
} from 'common/constants';
import { isServer } from 'common/utils/isEnvironment';
import {
  Icon,
  AuthTitle,
  AuthDescription,
  Button,
  TextWithLines,
  AuthLayout,
} from 'components';
import { login } from 'common/utils/authUtils';
import { getTrustedDeviceToken, setToken } from 'common/utils/token';
import SignInForm from './SignInForm';

const IconWrapper = styled.div`
  display: flex;
`;

const AuthWrapper = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  height: 60px;
  width: 100%;
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
  width: 60px;
  height: 100%;
  color: ${({ theme }) => theme.white};
`;

const GoogleAuthText = styled.div`
  margin: auto;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.white};
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

class SignInContainer extends Component {
  state = {
    googleAuthUrl: '',
  };

  async componentDidMount() {
    if (isServer) return;

    const url = await this.generateGoogleAuthUrl();

    if (this.state.googleAuthUrl === '') {
      this.setState({ googleAuthUrl: url });
    }
  }

  generateGoogleAuthUrl = async () => {
    const deviceToken = await getTrustedDeviceToken(true);
    return `${API_URI}/${AUTH_ENDPOINT}?redirect_uri=${APP_URI}/${REDIRECT_AUTH_ENDPOINT}&fingerprint=${deviceToken}`;
  };

  handleSubmit = async ({ email, password }, { setSubmitting, setErrors }) => {
    try {
      const jwt = await login(email, password);

      setToken(jwt);

      Router.push('/');
    } catch (e) {
      setErrors({ email: 'Wrong email', password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  renderHeader() {
    const { router } = this.props;

    return (
      <Fragment>
        <IconWrapper>
          <Icon name="logo-new" height={40} width={142} />
        </IconWrapper>
        <StyledButton onClick={() => router.push('/signup')}>
          Sign Up
        </StyledButton>
      </Fragment>
    );
  }

  render() {
    const { googleAuthUrl } = this.state;
    const isLinkShown = googleAuthUrl !== '';

    const renderedHeader = this.renderHeader();

    return (
      <AuthLayout headerComponent={renderedHeader}>
        <AuthTitle>Nice to meet you!</AuthTitle>
        <AuthDescription>Welcome to Caesar</AuthDescription>
        <SignInForm onSubmit={this.handleSubmit} />
        {isLinkShown && (
          <Fragment>
            <TextWithLines width={1}>OR</TextWithLines>
            <AuthWrapper href={googleAuthUrl}>
              <GoogleLogoWrapper>
                <Icon name="google" width={20} height={20} isInButton />
              </GoogleLogoWrapper>
              <GoogleAuthText>Log in with Google</GoogleAuthText>
            </AuthWrapper>
          </Fragment>
        )}
      </AuthLayout>
    );
  }
}

export default withTheme(withRouter(SignInContainer));
