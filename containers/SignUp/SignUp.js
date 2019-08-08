import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import Router, { withRouter } from 'next/router';
import {
  Icon,
  AuthTitle,
  AuthDescription,
  Button,
  AuthLayout,
} from 'components';
import { registration } from 'common/utils/authUtils';
import SignUpForm from './SignUpForm';

const IconWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
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
        <AuthTitle>Nice to meet you!</AuthTitle>
        <AuthDescription>Welcome to Caesar.Team!</AuthDescription>
        <SignUpForm onSubmit={this.handleSubmit} />
      </AuthLayout>
    );
  }
}

export default withTheme(withRouter(SignUpContainer));
