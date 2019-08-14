import React from 'react';
import styled from 'styled-components';
import {
  AuthTitle,
  AuthDescription,
  Button,
  Link,
  TextWithLines,
  CodeInput,
  Checkbox,
} from 'components';
import { FastField, Formik } from 'formik';
import { initialValues } from './constants';
import { codeSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QrCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`;

const QrCodeImage = styled.img`
  display: inline-block;
  width: 200px;
  height: 200px;
  vertical-align: top;
`;

const QrCodeImageWrapper = styled.div`
  display: flex;
  width: 200px;
  height: 200px;
  margin-right: 60px;
`;

const QrCodeKeyWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const QrCodeAndApplicationDescription = styled.div`
  display: flex;
  flex-direction: column;
`;

const QrCodeDescription = styled.div`
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.47px;
`;

const QrCodeKey = styled.span`
  font-size: 36px;
  letter-spacing: 1px;
  text-align: center;
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  max-width: 400px;
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

const ApplicationLink = styled.a`
  font-size: 14px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
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
  margin-top: 30px;
  margin-bottom: 30px;
`;

const CODE_LENGTH = 6;

const AUTHY_LINK = 'https://authy.com/';
const GOOGLE_AUTHENTICATOR_LINK =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';

const TwoFactorForm = ({ qr, code, onSubmit }) => (
  <Wrapper>
    <AuthTitle>Two Factor Authentication</AuthTitle>
    <AuthDescription>Scan the QR code in 2FA app</AuthDescription>
    <QrCodeWrapper>
      <QrCodeImageWrapper>
        <QrCodeImage src={qr} />
      </QrCodeImageWrapper>
      <QrCodeAndApplicationDescription>
        <QrCodeDescription>
          You can use{' '}
          <ApplicationLink target="_blank" href={AUTHY_LINK}>
            Authy
          </ApplicationLink>
          ,{' '}
          <ApplicationLink target="_blank" href={GOOGLE_AUTHENTICATOR_LINK}>
            Google Authenticator
          </ApplicationLink>{' '}
          or other similar app. If you haven’t QR-scan you can enter the key in
          the application:
        </QrCodeDescription>
        <QrCodeKeyWrapper>
          <QrCodeKey>{code}</QrCodeKey>
        </QrCodeKeyWrapper>
      </QrCodeAndApplicationDescription>
    </QrCodeWrapper>
    <TextWithLines>Enter the 6-digit code from the app</TextWithLines>
    <Formik
      key="codeForm"
      initialValues={initialValues}
      validationSchema={codeSchema}
      onSubmit={onSubmit}
      render={({
        errors,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values,
      }) => (
        <Form onSubmit={handleSubmit}>
          <FastField
            name="code"
            render={() => (
              <CodeInput
                onChange={value => setFieldValue('code', value, true)}
                length={CODE_LENGTH}
                focus
                disabled={isSubmitting}
                errors={errors}
              />
            )}
          />
          {errors.code && <Error>{errors.code}</Error>}
          <CheckboxWrapper>
            <FastField
              name="fpCheck"
              render={({ field }) => (
                <Checkbox {...field} checked={field.value}>
                  Remember device
                </Checkbox>
              )}
            />
          </CheckboxWrapper>
          <NextButton
            htmlType="submit"
            disabled={isSubmitting || values.code.length !== CODE_LENGTH}
          >
            Continue
          </NextButton>
        </Form>
      )}
    />
    <BottomWrapper>
      or <Link to="/logout">log out</Link>
    </BottomWrapper>
  </Wrapper>
);

export default TwoFactorForm;
