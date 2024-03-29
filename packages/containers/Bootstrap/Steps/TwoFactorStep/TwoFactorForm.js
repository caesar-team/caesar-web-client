import React, { memo } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { useNotification } from '@caesar/common/hooks';
import { media } from '@caesar/assets/styles/media';
import { useMedia } from '@caesar/common/hooks';
import {
  AuthTitle,
  AuthDescription,
  Button,
  TextWithLines,
  CodeInput,
  Checkbox,
} from '@caesar/components';

import { FastField, Formik } from 'formik';
import {
  initialValues,
  CODE_LENGTH,
  AUTHY_LINK,
  GOOGLE_AUTHENTICATOR_LINK,
} from './constants';
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
  width: 200px;
  height: 200px;
  object-fit: cover;
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
`;

const QrCodeKey = styled.span`
  font-size: ${({ theme }) => theme.font.size.large};
  text-align: center;

  ${media.wideMobile`
    font-size: ${({ theme }) => theme.font.size.big};
  `}
`;

const NextButton = styled(Button)`
  width: 100%;
  max-width: 400px;
`;

const ApplicationLink = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const TwoFactorForm = ({ qr, code, onSubmit }) => {
  const notification = useNotification();
  const { isDesktop, isWideDesktop } = useMedia();

  const handleCopy = value => () => {
    if (copy(value)) {
      notification.show({
        text: `The code has been copied`,
      });
    } else {
      notification.show({
        text: `The code has not been copied :(`,
      });
    }
  };

  return (
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
            or other similar app. If you haven’t QR-scan you can enter the key
            in the application:
          </QrCodeDescription>
          <QrCodeKeyWrapper onClick={handleCopy(code)}>
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
      >
        {({ errors, handleSubmit, isSubmitting, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <FastField name="code">
              {() => (
                <CodeInput
                  onChange={value => setFieldValue('code', value, true)}
                  length={CODE_LENGTH}
                  focus
                  disabled={isSubmitting}
                  errors={errors}
                />
              )}
            </FastField>
            <CheckboxWrapper>
              <FastField name="fpCheck">
                {({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Remember current device
                  </Checkbox>
                )}
              </FastField>
            </CheckboxWrapper>
            <NextButton
              htmlType="submit"
              isHigh={isDesktop || isWideDesktop}
              isUpperCase
              disabled={isSubmitting || values.code.length !== CODE_LENGTH}
            >
              Continue
            </NextButton>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default memo(TwoFactorForm);
