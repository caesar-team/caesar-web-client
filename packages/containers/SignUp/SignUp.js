import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import {
  AuthTitle,
  AuthDescription,
  AuthLayout,
  SecondaryHeader,
  withNotification,
} from '@caesar/components';
import { registration } from '@caesar/common/utils/authUtils';
import SignUpForm from './SignUpForm';

const headerComponent = <SecondaryHeader buttonText="Sign In" url="/signin" />;

class SignUpContainer extends Component {
  handleSubmit = async ({ email, password }, { setSubmitting, setErrors }) => {
    try {
      await registration(email, password);

      this.props.notification.show({
        text: 'You have successfully signed up',
      });

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

  render() {
    return (
      <AuthLayout headerComponent={headerComponent}>
        <AuthTitle>Nice to meet you!</AuthTitle>
        <AuthDescription>Welcome to Caesar.Team!</AuthDescription>
        <SignUpForm onSubmit={this.handleSubmit} />
      </AuthLayout>
    );
  }
}

export default withNotification(withTheme(withRouter(SignUpContainer)));
