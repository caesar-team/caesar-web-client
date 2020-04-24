import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import {
  AuthTitle,
  AuthDescription,
  CodeInput,
  Checkbox,
  Button,
  TextWithLines,
} from '@caesar/components';
import MobileImg from '@caesar/assets/images/mobile.png';
import { codeSchema } from './schema';
import {
  initialValues,
  CODE_LENGTH,
  AUTHY_LINK,
  GOOGLE_AUTHENTICATOR_LINK,
} from './constants';

const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
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

const TipWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`;

const MobileImage = styled.img`
  width: 90px;
  height: 175px;
  object-fit: cover;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 90px;
  height: 175px;
  margin-right: 60px;
`;

const ApplicationDescription = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.47px;
`;

const ApplicationLink = styled.a`
  font-size: 14px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  display: contents;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const NextButton = styled(Button)`
  height: 60px;
  font-size: 18px;
  margin-top: 60px;
`;

const TwoFactorCheckForm = ({ onSubmit }) => (
  <Wrapper>
    <AuthTitle>Two Factor Authentication</AuthTitle>
    <AuthDescription>Enter the code</AuthDescription>
    <TipWrapper>
      <ImageWrapper>
        <MobileImage src={MobileImg} />
      </ImageWrapper>
      <ApplicationDescription>
        Please open{' '}
        <ApplicationLink target="_blank" href={AUTHY_LINK}>
          Authy
        </ApplicationLink>{' '}
        or{' '}
        <ApplicationLink target="_blank" href={GOOGLE_AUTHENTICATOR_LINK}>
          Google Authenticator
        </ApplicationLink>{' '}
        app on your phone device and enter the code in the field below.
      </ApplicationDescription>
    </TipWrapper>
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
  </Wrapper>
);

export default TwoFactorCheckForm;
