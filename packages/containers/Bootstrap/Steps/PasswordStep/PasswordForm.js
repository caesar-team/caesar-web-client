import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { PasswordInput, Button, Icon } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { schema } from './schema';
import { initialValues } from './constants';

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledPasswordInput = styled(PasswordInput)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.lightGray};

  ${PasswordInput.InputField} {
    line-height: 20px;
  }

  ${PasswordInput.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
  }
`;

const Prefix = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${({ theme }) => theme.lightGray};
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 60px;
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
`;

const PasswordInputPrefix = (
  <Prefix>
    <Icon name="key-diagonal" width={18} height={18} />
  </Prefix>
);

const PasswordForm = ({ onSubmit }) => (
  <Formik
    key="newPassword"
    onSubmit={onSubmit}
    initialValues={initialValues}
    validationSchema={schema}
    render={({
      errors,
      touched,
      handleSubmit,
      setFieldTouched,
      isSubmitting,
      isValid,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Row>
          <FastField
            name="password"
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Password"
                prefix={PasswordInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'password') && (
            <Error>{errors.password}</Error>
          )}
        </Row>
        <Row>
          <FastField
            name="confirmPassword"
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Confirm password"
                prefix={PasswordInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'confirmPassword') && (
            <Error>{errors.confirmPassword}</Error>
          )}
        </Row>
        <ButtonWrapper>
          <NextButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Next
          </NextButton>
        </ButtonWrapper>
      </Form>
    )}
  />
);

export default PasswordForm;
