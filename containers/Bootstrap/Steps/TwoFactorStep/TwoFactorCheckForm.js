import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import {
  AuthTitle,
  AuthDescription,
  BackButtonWrapper,
  BackButton,
  CodeInput,
  Checkbox,
  Button,
} from 'components';
import { codeSchema } from './schema';
import { initialValues } from './constants';

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

const NextButton = styled(Button)`
  height: 60px;
  font-size: 18px;
  margin-top: 60px;
`;

const CODE_LENGTH = 6;

const TwoFactorCheckForm = ({ allowReturn, onClickReturn, onSubmit }) => (
  <Wrapper>
    {allowReturn && (
      <BackButtonWrapper>
        <BackButton onClick={onClickReturn}>
          Back to the previous step
        </BackButton>
      </BackButtonWrapper>
    )}
    <AuthTitle>Two Factor Authentication</AuthTitle>
    <AuthDescription>
      Enter the 6-digit code that you can find in the mobile application or from
      backup codes
    </AuthDescription>
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
        resetForm,
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
  </Wrapper>
);

export default TwoFactorCheckForm;
