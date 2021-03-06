import React, { Component } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import {
  AuthTitle,
  AuthLayout,
  LogoCaesarDomain,
  Button,
} from '@caesar/components';
import { changePassword } from '@caesar/common/utils/authUtils';
import ResetPasswordForm from './ResetPasswordForm';

const IconWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  padding: 18px 30px;
  height: 60px;
`;

class ResetPasswordContainer extends Component {
  handleSubmit = async ({ password }, { setSubmitting, setErrors }) => {
    const { email, token } = this.props;

    try {
      await changePassword(token, email, password);

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

  renderHeader() {
    const { router } = this.props;

    return (
      <>
        <IconWrapper>
          <LogoCaesarDomain width={146} height={45} />
        </IconWrapper>
        <StyledButton onClick={() => router.push(ROUTES.SIGN_IN)}>
          Sign In
        </StyledButton>
      </>
    );
  }

  render() {
    const renderedHeader = this.renderHeader();

    return (
      <AuthLayout headerComponent={renderedHeader}>
        <AuthTitle>Reset Password</AuthTitle>
        <ResetPasswordForm onSubmit={this.handleSubmit} />
      </AuthLayout>
    );
  }
}

export default ResetPasswordContainer;
