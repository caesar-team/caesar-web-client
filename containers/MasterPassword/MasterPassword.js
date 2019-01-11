import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { match } from 'common/utils/match';
import { checkError } from 'common/utils/formikUtils';
import { Icon, Button, MasterPasswordInput, Link } from '../../components';
import {
  REGEXP_TEXT_MATCH,
  STEP_CONFIRM_MASTER_PASSWORD,
  STEP_CREATE_MASTER_PASSWORD,
} from './constants';
import { passwordSchema, createConfirmPasswordSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 32px;
  text-align: center;
`;

const SetMasterPasswordText = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
  text-align: center;
  margin-bottom: 45px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
`;

const Form = styled.form``;

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

const BackText = styled.a`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
  margin-left: 10px;

  &:hover {
    color: ${({ theme }) => theme.gray};
  }
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
        render={({ errors, touched, handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Title>Master Password</Title>
            <SetMasterPasswordText>
              Create master password for Caesar
            </SetMasterPasswordText>
            <FastField
              name="password"
              render={({ field }) => (
                <MasterPasswordInput
                  {...field}
                  autoFocus
                  withIndicator
                  rules={REGEXP_TEXT_MATCH}
                  error={checkError(touched, errors, 'password')}
                />
              )}
            />
            <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
              Continue
            </StyledButton>
            <BottomWrapper>
              or <Link to="/logout">log out</Link>
            </BottomWrapper>
          </Form>
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
          <Form onSubmit={handleSubmit}>
            <Title>Сonfirmation</Title>
            <SetMasterPasswordText>
              Confirm your master password
            </SetMasterPasswordText>
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
            <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
              Confirm
            </StyledButton>
            <BottomWrapper>
              <Icon name="arrow-back" width={20} height={20} />
              <BackText onClick={this.handleClickReturn}>
                Back to the previous step
              </BackText>
            </BottomWrapper>
          </Form>
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
      <Wrapper>
        <LogoWrapper>
          <Icon name="logo" width={120} height={25} />
        </LogoWrapper>
        <InnerWrapper>{renderedStep}</InnerWrapper>
      </Wrapper>
    );
  }
}

export default MasterPassword;
