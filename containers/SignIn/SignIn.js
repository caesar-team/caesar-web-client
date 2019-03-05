import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import {
  API_URL,
  APP_URL,
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
} from 'components';
import { login } from 'common/utils/authUtils';
import { getTrustedDeviceToken, setToken } from 'common/utils/token';
import BgRightImg from 'static/images/bg-right.jpg';
import BgRightImg2x from 'static/images/bg-right@2x.jpg';
import BgLeftImg from 'static/images/bg-left.jpg';
import BgLeftImg2x from 'static/images/bg-left@2x.jpg';
import SignInForm from './SignInForm';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background: ${({ theme }) => theme.white};
`;

const InnerWrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 100px;
`;

const BgRightImage = styled.img`
  position: absolute;
  right: 60px;
  object-fit: contain;
`;

const BgLeftImage = styled.img`
  position: absolute;
  left: 60px;
  bottom: 90px;
  object-fit: contain;
`;

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

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30px;
`;

const FourXXIText = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
  margin-left: 10px;
`;

const FourXXILink = styled.a`
  text-decoration: underline;
  font-weight: 600;
  color: ${({ theme }) => theme.black};
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
    return `${API_URL}/${AUTH_ENDPOINT}?redirect_uri=${APP_URL}/${REDIRECT_AUTH_ENDPOINT}&fingerprint=${deviceToken}`;
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

  render() {
    const { router } = this.props;
    const { googleAuthUrl } = this.state;
    const isLinkShown = googleAuthUrl !== '';

    return (
      <Wrapper>
        <TopWrapper>
          <IconWrapper>
            <Icon name="logo-new" height={40} width={142} />
          </IconWrapper>
          <StyledButton onClick={() => router.push('/signup')}>
            Sign Up
          </StyledButton>
        </TopWrapper>
        <BgRightImage
          src={BgRightImg}
          srcSet={`${BgRightImg} 1x, ${BgRightImg2x} 2x`}
        />
        <BgLeftImage
          src={BgRightImg}
          srcSet={`${BgLeftImg} 1x, ${BgLeftImg2x} 2x`}
        />
        <InnerWrapper>
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
        </InnerWrapper>
        <BottomWrapper>
          <Icon name="logo-4xxi" width={20} height={20} />
          <FourXXIText>
            Created and supported by{' '}
            <FourXXILink href="https://4xxi.com/en">4xxi team</FourXXILink>
          </FourXXIText>
        </BottomWrapper>
      </Wrapper>
    );
  }
}

export default withTheme(withRouter(SignInContainer));
