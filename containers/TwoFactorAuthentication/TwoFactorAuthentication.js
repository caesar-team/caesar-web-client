import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import {
  AuthDescription,
  AuthLayout,
  AuthTitle,
  BackButton,
  Button,
  CodeInput,
} from 'components';
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

const BottomWrapper = styled.div`
  margin-top: 45px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
`;

const QrCodeImage = styled.img`
  display: inline-block;
  width: 200px;
  height: 200px;
  vertical-align: top;
  margin-bottom: 30px;
`;

const QrCodeKeyWrapper = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const QrCodeKeyTitle = styled.span`
  padding-right: 10px;
  padding-bottom: 4px;
  font-size: 18px;
  color: ${({ theme }) => theme.gray};
`;

const QrCodeKey = styled.span`
  font-size: 36px;
  letter-spacing: 1px;
`;

const NextButton = styled(Button)`
  width: 100%;
  font-size: 18px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Error = styled.div`
  padding-top: 6px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

class TwoFactorAuthentication extends Component {
  state = {
    code: '',
    step: STEP_CREATE_TWO_FACTOR_AUTHENTICATION,
  };

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

  renderCreateStep = () => (
    <div>
      <AuthTitle>Two Factor Authentication</AuthTitle>
      <AuthDescription>
        Scan the QR code above or manually enter in the application.
      </AuthDescription>
      <InnerWrapper>
        <QrCodeImage />
        <QrCodeKeyWrapper>
          <QrCodeKeyTitle>Key:</QrCodeKeyTitle>
          <QrCodeKey>11144432</QrCodeKey>
        </QrCodeKeyWrapper>
        <NextButton onClick={this.handleClickNext}>Next</NextButton>
      </InnerWrapper>
    </div>
  );

  renderConfirmStep = () => {
    const { code } = this.state;
    const { onSubmit } = this.props;

    return (
      <div>
        <AuthTitle>Two Factor Authentication</AuthTitle>
        <AuthDescription>
          Enter the 6-digit code that you can find in the mobile application.
        </AuthDescription>
        <Formik
          key="codeForm"
          initialValues={{ code }}
          isInitialValid={codeSchema.isValidSync({ code })}
          validationSchema={codeSchema}
          onSubmit={onSubmit}
          render={({
            errors,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            submitForm,
          }) => (
            <Form ref={this.form} onSubmit={handleSubmit}>
              <CodeInput
                onChange={value => setFieldValue('code', value, false)}
                onComplete={submitForm}
                length={6}
                focus
                disabled={isSubmitting}
              />
              {errors.code && <Error>{errors.code}</Error>}
            </Form>
          )}
        />
        <BottomWrapper>
          <BackButton onClick={this.handleClickReturn}>
            Back to the previous step
          </BackButton>
        </BottomWrapper>
      </div>
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
