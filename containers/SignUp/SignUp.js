import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import { Icon, AuthTitle, AuthDescription, Button } from 'components';
import { registration } from 'common/utils/authUtils';
import BgRightImg from 'static/images/bg-right.jpg';
import BgRightImg2x from 'static/images/bg-right@2x.jpg';
import BgLeftImg from 'static/images/bg-left.jpg';
import BgLeftImg2x from 'static/images/bg-left@2x.jpg';
import SignUpForm from './SignUpForm';

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

class SignUpContainer extends Component {
  handleSubmit = async ({ email, password }, { setSubmitting, setErrors }) => {
    try {
      await registration(email, password);

      Router.push('/signin');
    } catch (e) {
      setErrors({
        email: 'Wrong email',
        password: 'Wrong password',
        confirmPassword: 'Wrong password',
      });
      setSubmitting(false);
    }
  };

  render() {
    const { router } = this.props;

    return (
      <Wrapper>
        <TopWrapper>
          <IconWrapper>
            <Icon name="logo-new" height={40} width={142} />
          </IconWrapper>
          <StyledButton onClick={() => router.push('/signin')}>
            Sign In
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
          <SignUpForm onSubmit={this.handleSubmit} />
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

export default withTheme(withRouter(SignUpContainer));
