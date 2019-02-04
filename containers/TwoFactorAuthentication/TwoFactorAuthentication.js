import React, { Component } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { Formik } from 'formik';
import {
  WrapperAlignTop,
  AuthWrapper,
  AuthDescription,
  AuthLayout,
  AuthTitle,
  BackButtonWrapper,
  BackButton,
  Button,
  CodeInput,
  Checkbox,
} from 'components';
import { checkTwoFactor, createTwoFactor } from 'common/api';
import { setToken, getTrustedDeviceToken } from 'common/utils/token';
import { match } from 'common/utils/match';
import {
  STEP_CREATE_TWO_FACTOR_AUTHENTICATION,
  STEP_CONFIRM_TWO_FACTOR_AUTHENTICATION,
} from './constants';
import { codeSchema } from './schema';

const InnerWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
`;

const QrCodeImage = styled.img`
  display: inline-block;
  width: 200px;
  height: 200px;
  vertical-align: top;
  margin-bottom: 20px;
`;

const QrCodeKeyWrapper = styled.div`
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: center;
`;

const QrCodeKey = styled.span`
  font-size: 36px;
  letter-spacing: 1px;
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Error = styled.div`
  padding-top: 10px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

class TwoFactorAuthentication extends Component {
  state = this.prepareInitialState();

  handleClickReturn = () => {
    this.setState({
      step: STEP_CREATE_TWO_FACTOR_AUTHENTICATION,
    });
  };

  handleClickNext = () => {
    this.setState({
      step: STEP_CONFIRM_TWO_FACTOR_AUTHENTICATION,
    });
  };

  handleTwoFactorAuthenticationCreate = async (
    { code, fpCheck },
    { setSubmitting, setErrors },
  ) => {
    const post = { authCode: code, secret: this.props.code };

    if (fpCheck) {
      post.fingerprint = await getTrustedDeviceToken(true);
    }

    try {
      await createTwoFactor(post);
      this.props.initialize(() => Router.replace('/'));
    } catch (error) {
      setErrors({ code: 'Wrong code' });
      setSubmitting(false);
    }
  };

  handleTwoFactorAuthenticationCheck = async (
    { code, fpCheck },
    { setSubmitting, setErrors },
  ) => {
    const post = { authCode: code };

    if (fpCheck) {
      post.fingerprint = await getTrustedDeviceToken(true);
    }

    try {
      const {
        data: { token },
      } = await checkTwoFactor(post);

      setToken(token);
      this.props.initialize(() => Router.replace('/'));
    } catch (error) {
      setErrors({ code: 'Wrong code' });
      setSubmitting(false);
    }
  };

  getInitialValues = () => ({
    code: '',
    fpCheck: false,
  });

  prepareInitialState() {
    const { isCheck } = this.props;

    return {
      code: '',
      step: isCheck
        ? STEP_CONFIRM_TWO_FACTOR_AUTHENTICATION
        : STEP_CREATE_TWO_FACTOR_AUTHENTICATION,
    };
  }

  renderCreateStep = () => {
    const { qr, code } = this.props;

    return (
      <WrapperAlignTop>
        <AuthWrapper>
          <AuthTitle>Two Factor Authentication</AuthTitle>
          <AuthDescription>Scan the QR code above</AuthDescription>
          <InnerWrapper>
            <QrCodeImage src={qr} />
            <AuthDescription>
              or manually enter the key in the application:
            </AuthDescription>
            <QrCodeKeyWrapper>
              <QrCodeKey>{code}</QrCodeKey>
            </QrCodeKeyWrapper>
            <NextButton onClick={this.handleClickNext}>Next</NextButton>
          </InnerWrapper>
        </AuthWrapper>
      </WrapperAlignTop>
    );
  };

  renderConfirmStep = () => {
    const { code } = this.state;
    const { isCheck } = this.props;
    const action = isCheck
      ? this.handleTwoFactorAuthenticationCheck
      : this.handleTwoFactorAuthenticationCreate;

    return (
      <WrapperAlignTop>
        {!isCheck && (
          <BackButtonWrapper>
            <BackButton onClick={this.handleClickReturn}>
              Back to the previous step
            </BackButton>
          </BackButtonWrapper>
        )}
        <AuthWrapper>
          <AuthTitle>Two Factor Authentication</AuthTitle>
          <AuthDescription>
            Enter the 6-digit code that you can find in the mobile application.
          </AuthDescription>
          <Formik
            key="codeForm"
            initialValues={this.getInitialValues()}
            isInitialValid={codeSchema.isValidSync({ code })}
            validationSchema={codeSchema}
            onSubmit={action}
            render={({
              errors,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              submitForm,
              resetForm,
            }) => (
              <Form ref={this.form} onSubmit={handleSubmit}>
                <CodeInput
                  onChange={value => setFieldValue('code', value, false)}
                  onComplete={submitForm}
                  onCompleteWithErrors={resetForm}
                  length={6}
                  focus
                  disabled={isSubmitting}
                  errors={errors}
                />
                {errors.code && <Error>{errors.code}</Error>}
                <CheckboxWrapper>
                  <Checkbox
                    onChange={value => setFieldValue('fpCheck', value, false)}
                  >
                    Remember device
                  </Checkbox>
                </CheckboxWrapper>
              </Form>
            )}
          />
        </AuthWrapper>
      </WrapperAlignTop>
    );
  };

  render() {
    const { step } = this.state;

    const renderedStep = match(
      step,
      {
        STEP_CREATE_TWO_FACTOR_AUTHENTICATION: this.renderCreateStep(),
        STEP_CONFIRM_TWO_FACTOR_AUTHENTICATION: this.renderConfirmStep(),
      },
      null,
    );

    return <AuthLayout>{renderedStep}</AuthLayout>;
  }
}

export default TwoFactorAuthentication;
