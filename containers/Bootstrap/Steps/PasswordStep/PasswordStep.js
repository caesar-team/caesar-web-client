import React, { Component } from 'react';
import {
  AuthDescription,
  AuthLayout,
  AuthTitle,
  AuthWrapper,
  Head,
  WrapperAlignTop,
} from 'components';
import styled from 'styled-components';
import PasswordForm from './PasswordForm';

const InnerWrapper = styled(WrapperAlignTop)`
  max-width: 400px;
  width: 100%;
`;

class PasswordStep extends Component {
  handleSubmit = (
    { password, confirmPassword },
    { setSubmitting, setErrors },
  ) => {
    console.log(password, confirmPassword);
  };

  render() {
    return (
      <AuthLayout>
        <InnerWrapper>
          <Head title="Enter password which you received" />
          <AuthWrapper>
            <AuthTitle>Change Password</AuthTitle>
            <AuthDescription>Enter and confirm new password</AuthDescription>
            <PasswordForm onSubmit={this.handleSubmit} />
          </AuthWrapper>
        </InnerWrapper>
      </AuthLayout>
    );
  }
}

export default PasswordStep;
