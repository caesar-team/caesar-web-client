import React, { Component } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { AuthTitle, AuthLayout, Icon, Button } from '@caesar/components';
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

  renderHeader() {
    const { router } = this.props;

    return (
      <>
        <IconWrapper>
          <Icon name="logo-caesar-4xxi" height={40} width={142} />
        </IconWrapper>
        <StyledButton onClick={() => router.push('/signin')}>
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
