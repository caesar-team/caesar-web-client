import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import {
  WrapperAlignTop,
  AuthWrapper,
  AuthTitle,
  AuthDescription,
  BackButtonWrapper,
  BackButton,
  CodeInput,
  Checkbox,
} from 'components';
import { codeSchema } from './schema';
import { initialValues } from './constants';

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

class TwoFactorCheckForm extends Component {
  render() {
    const { allowReturn, onClickReturn, onSubmit } = this.props;

    return (
      <WrapperAlignTop>
        {allowReturn && (
          <BackButtonWrapper>
            <BackButton onClick={onClickReturn}>
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
            initialValues={initialValues}
            validationSchema={codeSchema}
            onSubmit={onSubmit}
            render={({
              errors,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              submitForm,
              resetForm,
            }) => (
              <Form onSubmit={handleSubmit}>
                <FastField
                  name="code"
                  render={() => (
                    <CodeInput
                      onChange={value => setFieldValue('code', value, false)}
                      onComplete={submitForm}
                      onCompleteWithErrors={resetForm}
                      length={6}
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
              </Form>
            )}
          />
        </AuthWrapper>
      </WrapperAlignTop>
    );
  }
}

export default TwoFactorCheckForm;
