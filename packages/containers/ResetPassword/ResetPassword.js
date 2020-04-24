import React, { Component, Fragment } from 'react';
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
  letter-spacing: 0.6px;
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
      <Fragment>
        <IconWrapper>
          <Icon name="logo-new" height={40} width={142} />
        </IconWrapper>
        <StyledButton onClick={() => router.push('/signin')}>
          Sign In
        </StyledButton>
      </Fragment>
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
