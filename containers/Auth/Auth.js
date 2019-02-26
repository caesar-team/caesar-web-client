import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
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
import { postLoginPrepare, postLogin } from 'common/api';
import { createSrp } from 'common/utils/srp';
import { getTrustedDeviceToken, setToken } from 'common/utils/token';
import BgRightImg from 'static/images/bg-right.jpg';
import BgRightImg2x from 'static/images/bg-right@2x.jpg';
import BgLeftImg from 'static/images/bg-left.jpg';
import BgLeftImg2x from 'static/images/bg-left@2x.jpg';
import AuthForm from './AuthForm';

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

const srp = createSrp();

const createMatcher = ({ email, password, A, a, B, seed }) => {
  const S = srp.generateClientS(A, B, a, srp.generateX(seed, email, password));
  const M1 = srp.generateM1(A, B, S);

  return { S, M1 };
};

class AuthContainer extends Component {
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
    const a = srp.getRandomSeed();
    const A = srp.generateA(a);

    try {
      const {
        data: { publicEphemeralValue: B, seed },
      } = await postLoginPrepare({ email, publicEphemeralValue: A });

      const { S, M1 } = createMatcher({ email, password, A, a, B, seed });

      const {
        data: { secondMatcher, jwt },
      } = await postLogin({ email, M1 });

      const clientM2 = srp.generateM2(A, M1, S);

      if (clientM2 !== secondMatcher) {
        throw new Error('mismatch');
      }

      setToken(jwt);
    } catch (e) {
      setErrors({ email: 'Wrong email', password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  render() {
    const { googleAuthUrl } = this.state;
    const isLinkShown = googleAuthUrl !== '';

    return (
      <Wrapper>
        <TopWrapper>
          <IconWrapper>
            <Icon name="logo-new" height={40} width={142} />
          </IconWrapper>
          <StyledButton disabled>Sign Up</StyledButton>
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
          <AuthForm onSubmit={this.handleSubmit} />
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
      </Wrapper>
    );
  }
}

export default withTheme(AuthContainer);
