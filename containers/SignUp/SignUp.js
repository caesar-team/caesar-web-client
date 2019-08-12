import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import {
  AuthTitle,
  AuthDescription,
  AuthLayout,
  SecondaryHeader,
} from 'components';
import { registration } from 'common/utils/authUtils';
import SignUpForm from './SignUpForm';

const headerComponent = <SecondaryHeader buttonText="Sign In" url="/signin" />;

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
    return (
      <AuthLayout headerComponent={headerComponent}>
        <AuthTitle>Nice to meet you!</AuthTitle>
        <AuthDescription>Welcome to Caesar.Team!</AuthDescription>
        <SignUpForm onSubmit={this.handleSubmit} />
      </AuthLayout>
    );
  }
}

export default withTheme(withRouter(SignUpContainer));
