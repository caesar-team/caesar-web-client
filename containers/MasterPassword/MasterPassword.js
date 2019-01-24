import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { match } from 'common/utils/match';
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
} from 'components';
import {
  REGEXP_TEXT_MATCH,
  STEP_CONFIRM_MASTER_PASSWORD,
  STEP_CREATE_MASTER_PASSWORD,
} from './constants';
import { passwordSchema, createConfirmPasswordSchema } from './schema';

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
    return {
      step: STEP_CREATE_MASTER_PASSWORD,
      password: '',
    };
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
