import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { match } from 'common/utils/match';
import { SHARED_FLOW, CREATE_MASTER_PASSWORD_FLOW } from 'common/constants';
import { checkError } from 'common/utils/formikUtils';
import {
  WrapperAlignTop,
  AuthWrapper,
  AuthLayout,
  BackButtonWrapper,
  BackButton,
  Button,
  MasterPasswordInput,
  Link,
  AuthTitle,
  AuthDescription,
  Head,
} from 'components';
import {
  REGEXP_TEXT_MATCH,
  STEP_ENTER_SHARED_MASTER_PASSWORD,
  STEP_CONFIRM_MASTER_PASSWORD,
  STEP_CREATE_MASTER_PASSWORD,
} from './constants';
import {
  passwordSchema,
  createConfirmPasswordSchema,
  checkPasswordSchema,
} from './schema';

const InnerWrapper = styled(WrapperAlignTop)`
  max-width: 400px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

class MasterPassword extends Component {
  state = this.prepareInitialState();

  handleSubmitCheckPassword = ({ checkPassword }, formikBag) => {
    const { onSubmitCheckSharedPassword } = this.props;

    const callback = () =>
      this.setState({
        step: STEP_CREATE_MASTER_PASSWORD,
      });

    onSubmitCheckSharedPassword(
      { password: checkPassword },
      formikBag,
      callback,
    );
  };

  handleSubmitPassword = ({ password }) => {
    this.setState({
      password,
      step: STEP_CONFIRM_MASTER_PASSWORD,
    });
  };

  handleSubmitConfirmPassword = ({ confirmPassword }, formikBag) => {
    this.props.onSubmit({ password: confirmPassword }, formikBag);
  };

  handleClickReturn = () => {
    this.setState({
      step: STEP_CREATE_MASTER_PASSWORD,
    });
  };

  prepareInitialState() {
    const { flow } = this.props;

    return {
      step:
        flow === SHARED_FLOW
          ? STEP_ENTER_SHARED_MASTER_PASSWORD
          : STEP_CREATE_MASTER_PASSWORD,
      password: '',
    };
  }

  renderEnterSharedPasswordStep() {
    const { checkPassword } = this.props;

    return (
      <Formik
        key="checkPassword"
        initialValues={{ checkPassword }}
        isInitialValid={checkPasswordSchema.isValidSync({ checkPassword })}
        validationSchema={checkPasswordSchema}
        onSubmit={this.handleSubmitCheckPassword}
        render={({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <form onSubmit={handleSubmit}>
            <Head title="Enter password which you received" />
            <AuthWrapper>
              <AuthTitle>Enter Shared Master Password</AuthTitle>
              <AuthDescription>
                Enter your shared master password from link
              </AuthDescription>
              <FastField
                name="checkPassword"
                render={({ field }) => (
                  <MasterPasswordInput
                    {...field}
                    autoFocus
                    error={
                      dirty
                        ? checkError(touched, errors, 'checkPassword')
                        : null
                    }
                  />
                )}
              />
              <StyledButton
                htmlType="submit"
                disabled={isSubmitting || !isValid}
              >
                Continue
              </StyledButton>
              <BottomWrapper>
                or <Link to="/logout">log out</Link>
              </BottomWrapper>
            </AuthWrapper>
          </form>
        )}
      />
    );
  }

  renderCreateStep() {
    const { password } = this.state;

    return (
      <Formik
        key="password"
        initialValues={{ password }}
        isInitialValid={passwordSchema.isValidSync({ password })}
        validationSchema={passwordSchema}
        onSubmit={this.handleSubmitPassword}
        render={({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <form onSubmit={handleSubmit}>
            <Head title="Create master password for Caesar" />
            <AuthWrapper>
              <AuthTitle>Master Password</AuthTitle>
              <AuthDescription>
                Create master password for Caesar
              </AuthDescription>
              <FastField
                name="password"
                render={({ field }) => (
                  <MasterPasswordInput
                    {...field}
                    autoFocus
                    withIndicator
                    rules={REGEXP_TEXT_MATCH}
                    error={
                      dirty ? checkError(touched, errors, 'password') : null
                    }
                  />
                )}
              />
              <StyledButton
                htmlType="submit"
                disabled={isSubmitting || !isValid}
              >
                Continue
              </StyledButton>
              <BottomWrapper>
                or <Link to="/logout">log out</Link>
              </BottomWrapper>
            </AuthWrapper>
          </form>
        )}
      />
    );
  }

  renderConfirmStep() {
    const { password } = this.state;

    return (
      <Formik
        key="confirmPassword"
        initialValues={{ confirmPassword: '' }}
        validationSchema={createConfirmPasswordSchema(password)}
        onSubmit={this.handleSubmitConfirmPassword}
        render={({ errors, touched, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <BackButtonWrapper>
              <BackButton onClick={this.handleClickReturn}>
                Back to the previous step
              </BackButton>
            </BackButtonWrapper>
            <AuthWrapper>
              <AuthTitle>Сonfirmation</AuthTitle>
              <AuthDescription>Confirm your master password</AuthDescription>
              <FastField
                name="confirmPassword"
                render={({ field }) => (
                  <MasterPasswordInput
                    {...field}
                    autoFocus
                    error={checkError(touched, errors, 'confirmPassword')}
                  />
                )}
              />
              <StyledButton
                htmlType="submit"
                disabled={isSubmitting || !isValid}
              >
                Confirm
              </StyledButton>
            </AuthWrapper>
          </form>
        )}
      />
    );
  }

  render() {
    const { step } = this.state;

    const renderedStep = match(
      step,
      {
        STEP_ENTER_SHARED_MASTER_PASSWORD: this.renderEnterSharedPasswordStep(),
        STEP_CREATE_MASTER_PASSWORD: this.renderCreateStep(),
        STEP_CONFIRM_MASTER_PASSWORD: this.renderConfirmStep(),
      },
      null,
    );

    return (
      <AuthLayout>
        <InnerWrapper>{renderedStep}</InnerWrapper>
      </AuthLayout>
    );
  }
}

export default MasterPassword;
